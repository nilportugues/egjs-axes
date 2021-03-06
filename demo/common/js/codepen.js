/* eslint-disable */
var homeUrl = window.location.href;
if (homeUrl.indexOf("#") !== -1) {
	homeUrl = homeUrl.substr(0, homeUrl.indexOf("#"));
}
homeUrl = homeUrl.split("/");
homeUrl.pop();
homeUrl = homeUrl.join("/") + "/";
window.HOMELINK = homeUrl;
window.LIBLINK = window.LIBLINK || [];
window.LIBLINK.push(homeUrl + "../../release/latest/dist/axes.pkgd.min.js");

function getDomainUrl() {
	return window.HOMELINK;
}
$("[codepen]").each(function () {
	var $el = this;
	var codepen = $el.getAttribute("codepen");
	var color = $el.getAttribute("codepen-color") || 0;
	var cssPath = "../../assets/css/" + codepen + ".css";
	var jsPath = "../../assets/js/" + codepen + ".js";
	var htmlPath = "../../assets/html/" + codepen + ".html";
	var $title = codepen;

	$.when(
		$.ajax({
			url: htmlPath,
			dataType: "text"
		}),
		$.ajax({
			url: cssPath,
			dataType: "text"
		}),
		$.ajax({
			url: jsPath,
			dataType: "text"
		})
	).done(function (html, css, js) {
		var $html = $(html[0]).filter(function(index, element) {
			return element.tagName === "DIV";
		});
		$html.attr("codepen", null).attr("codepen-color", null)
			.find("img").attr("src", function (i, val) {
				if (val.indexOf("http") === 0) {
					return val;
				}
				var url = val;
				if (/^\.\//.test(val)) {
					url = val.replace("./", "");
				} else if (/^\.\.\//.test(val)) {
					// url = val.replace("../", "assets/");
				}
				return getDomainUrl() + url;
			});
		$html.find("[style*='url']").attr("style", function(i, val) {
			var val1 = val;
			var matches = val.match(/url\(([^\)]*)\)/g);
			var length = matches.length;
			for (var i = 0; i < length; ++i) {
				var val2 = matches[i].replace("url('", "").replace("')", "").replace("url(\"", "").replace("\")", "");
				if (val2.indexOf("http") === 0) {
					continue;
				}
				var url = val2;
				if (/^\.\//.test(val2)) {
					url = val2.replace("./", "");
				} else if (/^\.\.\//.test(val2)) {
					// url = val2.replace("../", "assets/");
				}
				url = getDomainUrl() + url;
				val1 = val1.replace(val2, url);
			}
			return val1;
		});
		var data = {
			title: $title,
			private: false,
			header: "<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=medium-dpi'>",
			html: $html.get(0).outerHTML,
			html_pre_processor: "none",
			css: css[0].replace(/(\.+\/)/g, getDomainUrl() + "$1"),
			css_pre_processor: "none",
			css_starter: "neither",
			css_prefix_free: false,
			js: js[0].replace("window.HOMELINK", '"' + getDomainUrl() + '"'),
			js_pre_processor: "babel",
			html_classes: "loading",
			css_external: "",
			js_external: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js;" + window.LIBLINK.join(";")
		};
		$el.insertAdjacentHTML("afterbegin", '<form class="codepenform" action="https://codepen.io/pen/define" method="POST" target="_blank">' +
			'<input type="hidden" name="data" value=\'' + JSON.stringify(data).replace(/"/g, "&quot;").replace(/'/g, "&apos;") + '\'>' +
			'<input type="image" src="../../common/image/cp-arrow-right' + (color ? "" : "-black") + '.svg" width="40" height="40" value="Create New Pen with Prefilled Data" class="codepen-mover-button" style="position:fixed;z-index:5;right: 10px; top: 5px;">' +
			'</form>');
	}).fail(function (e) {
		console.error("error");
	});

});