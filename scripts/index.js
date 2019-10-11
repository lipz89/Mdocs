window.app = (function () {
    function setAnchors(ele, anchors) {
        var ul = $("<ul>");
        for (let i = 0; i < anchors.length; i++) {
            const anchor = anchors[i];
            var li = $("<li>").addClass("a" + anchor.tag);
            var a = $("<a href='#" + anchor.id + "' title='" + anchor.txt + "'>");
            a.html(anchor.txt);
            li.append(a);
            ul.append(li);
        }
        ul.css("list-style-type", "square").css("margin-left", "25px")
        ele.append(ul);
    }

    function setMenus(ele, menus, listtype, toggleable) {
        var ul = $("<ul>");
        if (toggleable) {
            ul.addClass("toggle");
        }
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i];
            var li = $("<li>");
            var a = $("<a href='javascript:void(0);' title='" + menu.title + "'>");
            a.html(menu.title);
            if (menu.file) {
                a.data("source", menu.file);
                a.addClass("menulink");
            }
            li.append(a);
            ul.append(li);
            if (menu.items && menu.items.length) {
                setMenus(li, menu.items, menu.listtype, true);
                li.addClass("toggle");
                li.prepend("<span class='toggle'>+</span>")
            }
        }
        if (toggleable) {
            ul.hide();
        }
        if (listtype) {
            ul.css("list-style-type", listtype).css("margin-left", "25px")
        }
        ele.append(ul);
    }

    function setSlider() {
        var width = $("div.document").width();
        var allw = $(document).width();
        var slideWidth = width / 4 - 10;
        var left = (allw - width) / 2;
        $(".document>.slidebar").css("width", slideWidth + "px");
        $(".document>.slidebar").css("left", left + "px");
        var height = document.body.clientHeight;
        var top = window.app.slider.offset().top;
        var slideHeight = height - top;
        window.app.slider.css("max-height", slideHeight + "px");
    }

    function loadJs(src) {
        if ($(document.body).find("script[src='" + src + "']").length === 0) {
            $(document.body).append("<script src='" + src + "' type='text/javascript' async></script>");
        }
    }

    function loadLanguages(code) {
        var src = "/highlight/languages/" + code + ".js";
        loadJs(src);
    }

    function loadmd(source, success, showmd = false) {
        try {
            $.get(source).then(function (md) {
                var containText = md;
                if (showmd) {
                    md = md.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
                    containText = "<pre><code class=\"language-md hljs\">" + md + "</code></pre>";
                } else {
                    containText = marked(md);
                }
                window.app.container.html(containText);

                var tableEls = document.getElementsByTagName('table');
                for (var i = 0, ii = tableEls.length; i < ii; i++) {
                    var tableEl = tableEls[i];
                    tableEl.className = 'table table-striped table-bordered';
                }

                document.querySelectorAll('pre code').forEach(function (block) {
                    hljs.highlightBlock(block);
                });
                location.hash = "";
                success && success();
            }, function (e) {
                window.app.container.html(e.responseText || "<pre>Cannot GET " + source + "</pre>");
            });
        } catch (ex) {
            window.app.container.html(ex);
        }
    }

    $(document).ready(function () {
        window.app.title = "MDocApis"
        window.app.titleEle = $(window.app.titleSelector);
        window.app.container = $(window.app.containerSelector);
        window.app.copyrightEle = $(window.app.copyrightSelector);
        window.app.slider = $(window.app.slideSelector);

        setSlider();
        $(window).resize(setSlider);

        $(document).find("div.navmore .top").click(function () {
            $(document).scrollTop(0);
        });
        $(document).find("div.navmore .source").click(function () {
            var link = $("a[showing]");
            if (link.length == 1) {
                if (link.attr("showing") == "source") {
                    link.trigger("click");
                } else {
                    var url = link.data("source");
                    loadmd(url, null, true);

                    window.app.slider.find("li>a.active").closest("li").find(">ul").remove();
                    window.app.slider.find("li>a.active").closest("li").find(">span.toggle").remove();

                    window.app.titleEle.html(link.text() + " - 源码");
                    document.title = link.text() + " - 源码 - " + window.app.title;
                    link.attr("showing", "source")
                }
            }
        });


        var toggle = function (ele) {
            if (ele.length === 0) {
                return;
            }
            var li = ele.closest("li.toggle");
            var ul = li.find(">ul");
            if (ul.is(":visible")) {
                ul.slideUp(100);
                ele.html("+");
            } else {
                // li.closest("ul").find(">li.toggle>ul").slideUp(100);
                // li.closest("ul").find(">li.toggle>span.toggle").html("+");
                ul.slideDown(100);
                ele.html("-");
            }
        }

        window.app.slider.delegate("span.toggle", "click", function (e) {
            toggle($(this))
        });
        window.app.slider.delegate("li.toggle>a:not(.menulink)", "click", function (e) {
            toggle($(this).closest("li").find(">span.toggle"))
        });

        $(".document>.slidebar").delegate(".menus>span.positioning", "click", function () {
            var li = window.app.slider.find("li>a.active").closest("li");
            var ul = li.closest("ul");
            if (ul.is(":hidden")) {
                li.closest("ul").slideDown(100);
                li.closest("ul").closest("li.toggle").find(">span.toggle").html("-");
            }
            window.app.slider.find("li.toggle>ul.toggle").not(ul).slideUp(100);
            window.app.slider.find("li.toggle>ul.toggle").not(ul).closest("li.toggle").find(">span.toggle").html("+");
        });

        $(".document>.slidebar").delegate(".menus>span.collect", "click", function () {
            window.app.slider.find("li.toggle>ul").slideUp(100);
            window.app.slider.find("li.toggle>span.toggle").html("+");
        });

        $(".document>.slidebar").delegate(".menus>span.expand", "click", function () {
            window.app.slider.find("li.toggle>ul").slideDown(100);
            window.app.slider.find("li.toggle>span.toggle").html("-");
        });

        window.app.slider.delegate("li a.menulink", "click", function () {
            var link = $(this);
            if (link.is(".active") && link.attr("showing") != "source") {
                return;
            }
            var source = link.data("source");
            if (source) {
                loadmd(source, function () {
                    var anchors = window.app.container.find("h2[id],h3[id],h4[id]")
                        .map(function (i, x) {
                            return {
                                tag: x.tagName,
                                txt: $(x).text(),
                                id: $(x).attr("id")
                            };
                        })
                        .get();
                    if (anchors.length) {
                        var li = link.closest("li");
                        li.addClass("toggle");
                        li.prepend("<span class='toggle'>-</span>")
                        setAnchors(li, anchors);
                    }
                });
            }
            window.app.slider.find("li>a.active").closest("li").find(">ul").remove();
            window.app.slider.find("li>a.active").closest("li").find(">span.toggle").remove();
            window.app.slider.find("li>a.active").removeClass("active");
            link.addClass("active");

            window.app.titleEle.html(link.text());
            document.title = link.text() + " - " + window.app.title;
            $("a[showing]").removeAttr("showing")
            link.attr("showing", "doc")
        })

        function loadHighLanguages() {
            var array = ['1c',
                'abnf', 'accesslog', 'actionscript', 'ada', 'angelscript', 'apache',
                'applescript', 'arcade', 'arduino', 'armasm', 'asciidoc', 'aspectj',
                'autohotkey', 'autoit', 'avrasm', 'awk', 'axapta',
                'bash', 'basic', 'bnf', 'brainfuck',
                'cal', 'capnproto', 'ceylon', 'clean', 'clojure-repl', 'clojure',
                'cmake', 'coffeescript', 'coq', 'cos', 'cpp', 'crmsh', 'crystal', 'cs', 'csp', 'css',
                'd', 'dart', 'delphi', 'diff', 'django', 'dns', 'dockerfile', 'dos', 'dsconfig', 'dts', 'dust',
                'ebnf', 'elixir', 'elm', 'erb', 'erlang-repl', 'erlang', 'excel',
                'fix', 'flix', 'fortran', 'fsharp',
                'gams', 'gauss', 'gcode', 'gherkin', 'glsl', 'gml', 'go', 'golo', 'gradle', 'groovy',
                'haml', 'handlebars', 'haskell', 'haxe', 'hsp', 'htmlbars', 'http', 'hy',
                'inform7', 'ini', 'irpf90', 'isbl',
                'java', 'javascript', 'jboss-cli', 'json', 'julia-repl', 'julia',
                'kotlin',
                'lasso', 'ldif', 'leaf', 'less', 'lisp', 'livecodeserver', 'livescript', 'llvm', 'lsl', 'lua',
                'makefile', 'markdown', 'mathematica', 'matlab', 'maxima', 'mel',
                'mercury', 'mipsasm', 'mizar', 'mojolicious', 'monkey', 'moonscript',
                'n1ql', 'nginx', 'nimrod', 'nix', 'nsis',
                'objectivec', 'ocaml', 'openscad', 'oxygene',
                'parser3', 'perl', 'pf', 'pgsql', 'php', 'plaintext', 'pony', 'powershell', 'processing',
                'profile', 'prolog', 'properties', 'protobuf', 'puppet', 'purebasic', 'python',
                'q', 'qml',
                'r', 'reasonml', 'rib', 'roboconf', 'routeros', 'rsl', 'ruby', 'ruleslanguage', 'rust',
                'sas', 'scala', 'scheme', 'scilab', 'scss', 'shell', 'smali', 'smalltalk',
                'sml', 'sqf', 'sql', 'stan', 'stata', 'step21', 'stylus', 'subunit', 'swift',
                'taggerscript', 'tap', 'tcl', 'tex', 'thrift', 'tp', 'twig', 'typescript',
                'vala', 'vbnet', 'vbscript-html', 'vbscript', 'verilog', 'vhdl', 'vim',
                'x86asm', 'xl', 'xml', 'xquery',
                'yaml',
                'zephir']
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                loadLanguages(element);
            }
        }

        loadHighLanguages();

        window.app.copyrightEle.find("a.mddemo").click(function () {
            loadmd("docs/mddemo.md");
            $("a[showing]").removeAttr("showing")
            $(this).data("source", "docs/mddemo.md").attr("showing", "doc")
            title = $(this).text()

            window.app.slider.find("li>a.active").closest("li").find(">ul").remove();
            window.app.slider.find("li>a.active").closest("li").find(">span.toggle").remove();
            window.app.slider.find("li>a.active").removeClass("active");
            document.title = title + " - " + window.app.title;
            window.app.titleEle.html(title);
        });

        window.app.copyrightEle.find("a.mdoc").click(function () {
            loadmd("docs/mdoc.md");
            $("a[showing]").removeAttr("showing")
            $(this).data("source", "docs/mdoc.md").attr("showing", 0)
            title = $(this).text()

            window.app.slider.find("li>a.active").closest("li").find(">ul").remove();
            window.app.slider.find("li>a.active").closest("li").find(">span.toggle").remove();
            window.app.slider.find("li>a.active").removeClass("active");
            document.title = title + " - " + window.app.title;
            window.app.titleEle.html(title);
        });
    })

    function loadConfig(url) {
        $.get(url).then(function (data) {
            if (data.title) {
                document.title = data.title;
                window.app.title = data.title;
                window.app.titleEle.html(data.title);
            }
            if (window.app.copyrightEle.length) {
                window.app.copyrightEle.find(">span:eq(0)").html(data.copyright + " | by " + data.author + ". | V" + data.version);
            }

            if (data.menus && data.menus.length) {
                window.app.slider.empty();
                setMenus(window.app.slider, data.menus, null, false);
                window.app.container.html("<pre>请从左侧目录选择要查看的接口说明。</pre>");
                var first = window.app.slider.find("li>a.menulink:eq(0)");
                first.closest("ul.toggle").closest("li.toggle").find(">span.toggle").click();
                first.length && first.trigger("click");
            } else {
                window.app.slider.append("未定义目录");
                window.app.container.html("<pre>未定义目录配置。</pre>");
            }
        }, function (e) {
            window.app.container.html(e.responseText);
        })
    }


    return {
        slideSelector: ".slidebar>.slidepnl",
        titleSelector: ".document>.main .maintitle",
        containerSelector: ".document>.main .maindoc",
        copyrightSelector: ".copyright",

        init: function (docs) {
            var doctop = $("div.document>.floatmenu>div.list>ul");
            for (let index = 0; index < docs.length; index++) {
                const element = docs[index];
                var pdf = element.config.replace(".json", ".pdf")
                var a = $("<a href='javascript:void(0);'>").data("config", element.config).text(element.name);
                var dn = $("<a class='pdfdn' target='_blank' title='下载 " + element.name + "' href='/merge/" + pdf + "'>").text("⇩");
                var li = $("<li>").append(a).append(dn);
                doctop.append(li);
                a.click(jump);
            }
            var ulhtml = doctop.clone(true);
            $("div.document>.main>div.maindoc").append("<div style='font-size:20px;'>请选择要查看的API:</div>").append(ulhtml);
            function jump(e) {
                var link = $(this);
                var config = "jsons/" + link.data("config");
                loadConfig(config);
                $(".document>.slidebar").show();
                return false;
            }
        }
    }
})();