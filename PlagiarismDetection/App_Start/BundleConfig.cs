using System.Web;
using System.Web.Optimization;

namespace PlagiarismDetection
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/public/js/pd").Include(
               "~/public/assets/jquery/js/jquery-3.3.1.js",
               "~/public/assets/bootstrap-3.3.7/js/bootstrap.js",
               "~/public/assets/nprogress/js/nprogress.js",
               "~/public/assets/fastclick/js/fastclick.js",
               "~/public/assets/iCheck/js/icheck.js",
               "~/public/js/common/jquery-form.js",
               "~/public/js/common/jquery-cookie.js",
               "~/public/js/common/secure.js",
               "~/public/js/common/common.js",
               "~/public/js/common/message.js",
               "~/public/js/common/notification.js",
               "~/public/js/common/admin.js"
           ));
            bundles.Add(new StyleBundle("~/public/css/pd").Include(
                "~/public/assets/bootstrap-3.3.7/css/bootstrap.css",
                "~/public/assets/font-awesome-4.7.0/css/font-awesome.css",
                "~/public/assets/nprogress/css/nprogress.css",
                "~/public/assets/iCheck/skins/flat/green.css",
                "~/public/css/common/admin.css"
            ));
        }
    }
}
