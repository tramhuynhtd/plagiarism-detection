using PlagiarismDetection.Common;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Web;

namespace PlagiarismDetection.Models
{
    class MossRequest
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MossRequest"/> class.
        /// </summary>
        public MossRequest()
        {
            this.Files = new List<string>();
            this.BaseFile = new List<string>();
            this.UserId = 0;
            this.Server = "moss.stanford.edu";
            this.Port = 7690;
            this.language = string.Empty;
            this.comments = string.Empty;
            this.MaxMatches = ConstanstsEnum.MAXMATCHES;
            this.NumberOfResultsToShow = ConstanstsEnum.NUMBEROFRESULTSTOSHOW;
            this.IsDirectoryMode = false;
            this.IsBetaRequest = false;
        }

        /// <summary>
        /// The file upload format string. 
        /// </summary>
        private const string FileUploadFormat = "file {0} {1} {2} {3}\n";

        /// <summary>
        /// Gets an object representing the collection of the Source File(s) contained in this Request.
        /// </summary>
        public List<string> Files { get; private set; }

        /// <summary>
        /// Gets an object representing the collection of the Base File(s) contained in this Request. (-b)
        /// </summary>
        public List<string> BaseFile { get; private set; }

        /// <summary>
        /// Gets or sets the user identifier.
        /// </summary>
        public long UserId { get; set; } = 1;

        /// <summary>
        /// Gets or sets the server.
        /// </summary>
        private string Server { get; set; } = "moss.stanford.edu";

        /// <summary>
        /// Gets or sets the port.
        /// </summary>
        private int Port { get; set; } = 7690;

        /// <summary>
        /// The language for this request. (-l)
        /// </summary>
        private string language = ConstanstsEnum.LANGUAGE;
        public string Language
        {
            get => this.language;

            set => this.language = value ?? string.Empty;
        }

        /// <summary>
        /// The comments for this request. (-c)
        /// </summary>
        private string comments;
        public string Comments
        {
            get => this.comments;

            set => this.comments = value ?? string.Empty;
        }

        /// <summary>
        /// Gets or sets the maximum matches. (-m)
        /// </summary>
        public int MaxMatches { get; set; } = ConstanstsEnum.MAXMATCHES;

        /// <summary>
        /// Gets or sets the number of results to show. (-n)
        /// </summary>
        public int NumberOfResultsToShow { get; set; } = ConstanstsEnum.NUMBEROFRESULTSTOSHOW;

        /// <summary>
        /// Gets or sets a value indicating whether this instance is directory mode. (-d)
        /// </summary>
        public bool IsDirectoryMode { get; set; } = false;

        /// <summary>
        /// Gets or sets a value indicating whether this instance is beta request.
        /// </summary>
        /// <value>
        /// <c>true</c> if this instance is beta request; otherwise, <c>false</c>.
        /// </value>
        /// <remarks>
        /// ++ Represents the -x option sends queries to the current experimental version of the server. 
        /// The experimental server has the most recent Moss features and is also usually 
        /// less stable (read: may have more bugs).
        /// </remarks>
        public bool IsBetaRequest { get; set; } = false;

        /// <summary>
        /// Gets or sets the moss socket.
        /// </summary>
        private Socket MossSocket { get; set; }

        /// <summary>
        /// Gets or sets the size of the response byte array.
        /// </summary>
        private int ReplySize { get; set; } = 512;

        /// <summary>
        /// Sends the request.
        /// </summary>
        /// <param name="response">The response from the request.</param>
        /// <returns>
        /// <code>true</code> if the response was successful, otherwise <code>false</code>
        /// </returns>
        /// <remarks>
        /// If the request is successful, <code>true</code> is returned, then response is a valid <see cref="System.Uri"/>
        /// </remarks>
        public bool SendRequest(out string response)
        {
            try
            {
                var hostEntry = Dns.GetHostEntry(this.Server);
                var address = hostEntry.AddressList[0];
                var ipe = new IPEndPoint(address, this.Port);
                string result;
                using (var socket = new Socket(ipe.AddressFamily, SocketType.Stream, ProtocolType.Tcp))
                {
                    socket.Connect(ipe);

                    this.SendOption(
                        "moss",
                        this.UserId.ToString(CultureInfo.InvariantCulture),
                        socket);
                    this.SendOption("directory", this.IsDirectoryMode ? "1" : "0", socket);
                    this.SendOption("X", this.IsBetaRequest ? "1" : "0", socket);
                    this.SendOption(
                        "maxmatches",
                        this.MaxMatches.ToString(CultureInfo.InvariantCulture),
                        socket);
                    this.SendOption(
                        "show",
                        this.NumberOfResultsToShow.ToString(CultureInfo.InvariantCulture),
                        socket);

                    if (this.BaseFile.Count != 0)
                    {
                        foreach (var file in this.BaseFile)
                        {
                            this.SendFile(file, socket, 0);
                        }
                    }

                    if (this.Files.Count != 0)
                    {
                        int fileCount = 1;
                        foreach (var file in this.Files)
                        {
                            this.SendFile(file, socket, fileCount++);
                        }
                    }

                    this.SendOption("query 0", this.Comments, socket);

                    var bytes = new byte[this.ReplySize];
                    socket.Receive(bytes);

                    result = Encoding.UTF8.GetString(bytes);
                    this.SendOption("end", string.Empty, socket);
                }

                if (Uri.TryCreate(result, UriKind.Absolute, out var url))
                {
                    response = url?.ToString().IndexOf("\n", System.StringComparison.Ordinal) > 0
                                   ? url.ToString().Split('\n')[0]
                                   : url?.ToString();
                    return true;
                } // else, not a valid URL, DoNothing();

                response = Notifications.Moss_Request_URI_Error;
                return false;
            }
            catch (Exception ex)
            {
                // TODO Change from exception never catch exception...
                response = ex.Message;
                return false;
            }
        }

        /// <summary>
        /// Sends the argument using the given socket.
        /// </summary>
        /// <param name="option">The option.</param>
        /// <param name="value">The value of the argument.</param>
        /// <param name="socket">The OPEN socket.</param>
        /// <remarks>
        /// Assumes that the socket is open!
        /// </remarks>
        private void SendOption(string option, string value, Socket socket)
        {
            socket.Send(Encoding.UTF8.GetBytes($"{option} {value}\n"));
        }

        /// <summary>
        /// Sends the file using the given socket.
        /// </summary>
        /// <param name="file">The file to send.</param>
        /// <param name="socket">The OPEN socket.</param>
        /// <param name="number">A unique id number for the file.</param>
        /// <remarks>
        /// Assumes that the socket is open!
        /// </remarks>
        private void SendFile(string file, Socket socket, int number)
        {
            var fileInfo = new FileInfo(file);
            socket.Send(
                this.IsDirectoryMode
                    ? Encoding.UTF8.GetBytes(
                        string.Format(
                            FileUploadFormat,
                            number,
                            this.language,
                            fileInfo.Length,
                            fileInfo.FullName.Replace("\\", "/").Replace(" ", string.Empty)))
                    : Encoding.UTF8.GetBytes(
                        string.Format(
                            FileUploadFormat,
                            number,
                            this.language,
                            fileInfo.Length,
                            fileInfo.Name.Replace(" ", string.Empty))));
            Console.WriteLine(fileInfo.FullName.Replace("\\", "/").Replace(" ", string.Empty));
            socket.BeginSendFile(file, FileSendCallback, socket);
        }

        private static void FileSendCallback(IAsyncResult result)
        {
            var client = result.AsyncState as Socket;
            client?.EndSendFile(result);
        }
    }
}