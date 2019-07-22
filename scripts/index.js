window.app = (function () {
    function setAnchors(ele, anchors) {
        var ul = $("<ul>");
        for (let i = 0; i < anchors.length; i++) {
            const anchor = anchors[i];
            var li = $("<li>").addClass("a" + anchor.tag);
            var a = $("<a href='#" + anchor.id + "'>");
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
            var a = $("<a href='javascript:void(0);'>");
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
            $(document.body).append("<script src='" + src + "' type='text/javascript'></script>");
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
            var link = window.app.slider.find("a.menulink.active");
            if (link.length == 1) {
                if (link.data("showsource")) {
                    link.trigger("click");
                } else {
                    var url = link.data("source");
                    loadmd(url, null, true);

                    window.app.slider.find("li>a.active").closest("li").find(">ul").remove();
                    window.app.slider.find("li>a.active").closest("li").find(">span.toggle").remove();

                    window.app.titleEle.html(link.text() + " - 源码");
                    document.title = link.text() + " - 源码 - " + window.app.title;
                    link.data("showsource", true);
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
            if (link.is(".active") && !link.data("showsource")) {
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
            link.data("showsource", false)
        })

        loadLanguages('1c');
        loadLanguages('abnf');
        loadLanguages('accesslog');
        loadLanguages('actionscript');
        loadLanguages('ada');
        loadLanguages('angelscript');
        loadLanguages('apache');
        loadLanguages('applescript');
        loadLanguages('arcade');
        loadLanguages('arduino');
        loadLanguages('armasm');
        loadLanguages('asciidoc');
        loadLanguages('aspectj');
        loadLanguages('autohotkey');
        loadLanguages('autoit');
        loadLanguages('avrasm');
        loadLanguages('awk');
        loadLanguages('axapta');
        loadLanguages('bash');
        loadLanguages('basic');
        loadLanguages('bnf');
        loadLanguages('brainfuck');
        loadLanguages('cal');
        loadLanguages('capnproto');
        loadLanguages('ceylon');
        loadLanguages('clean');
        loadLanguages('clojure-repl');
        loadLanguages('clojure');
        loadLanguages('cmake');
        loadLanguages('coffeescript');
        loadLanguages('coq');
        loadLanguages('cos');
        loadLanguages('cpp');
        loadLanguages('crmsh');
        loadLanguages('crystal');
        loadLanguages('cs');
        loadLanguages('csp');
        loadLanguages('css');
        loadLanguages('d');
        loadLanguages('dart');
        loadLanguages('delphi');
        loadLanguages('diff');
        loadLanguages('django');
        loadLanguages('dns');
        loadLanguages('dockerfile');
        loadLanguages('dos');
        loadLanguages('dsconfig');
        loadLanguages('dts');
        loadLanguages('dust');
        loadLanguages('ebnf');
        loadLanguages('elixir');
        loadLanguages('elm');
        loadLanguages('erb');
        loadLanguages('erlang-repl');
        loadLanguages('erlang');
        loadLanguages('excel');
        loadLanguages('fix');
        loadLanguages('flix');
        loadLanguages('fortran');
        loadLanguages('fsharp');
        loadLanguages('gams');
        loadLanguages('gauss');
        loadLanguages('gcode');
        loadLanguages('gherkin');
        loadLanguages('glsl');
        loadLanguages('gml');
        loadLanguages('go');
        loadLanguages('golo');
        loadLanguages('gradle');
        loadLanguages('groovy');
        loadLanguages('haml');
        loadLanguages('handlebars');
        loadLanguages('haskell');
        loadLanguages('haxe');
        loadLanguages('hsp');
        loadLanguages('htmlbars');
        loadLanguages('http');
        loadLanguages('hy');
        loadLanguages('inform7');
        loadLanguages('ini');
        loadLanguages('irpf90');
        loadLanguages('isbl');
        loadLanguages('java');
        loadLanguages('javascript');
        loadLanguages('jboss-cli');
        loadLanguages('json');
        loadLanguages('julia-repl');
        loadLanguages('julia');
        loadLanguages('kotlin');
        loadLanguages('lasso');
        loadLanguages('ldif');
        loadLanguages('leaf');
        loadLanguages('less');
        loadLanguages('lisp');
        loadLanguages('livecodeserver');
        loadLanguages('livescript');
        loadLanguages('llvm');
        loadLanguages('lsl');
        loadLanguages('lua');
        loadLanguages('makefile');
        loadLanguages('markdown');
        loadLanguages('mathematica');
        loadLanguages('matlab');
        loadLanguages('maxima');
        loadLanguages('mel');
        loadLanguages('mercury');
        loadLanguages('mipsasm');
        loadLanguages('mizar');
        loadLanguages('mojolicious');
        loadLanguages('monkey');
        loadLanguages('moonscript');
        loadLanguages('n1ql');
        loadLanguages('nginx');
        loadLanguages('nimrod');
        loadLanguages('nix');
        loadLanguages('nsis');
        loadLanguages('objectivec');
        loadLanguages('ocaml');
        loadLanguages('openscad');
        loadLanguages('oxygene');
        loadLanguages('parser3');
        loadLanguages('perl');
        loadLanguages('pf');
        loadLanguages('pgsql');
        loadLanguages('php');
        loadLanguages('plaintext');
        loadLanguages('pony');
        loadLanguages('powershell');
        loadLanguages('processing');
        loadLanguages('profile');
        loadLanguages('prolog');
        loadLanguages('properties');
        loadLanguages('protobuf');
        loadLanguages('puppet');
        loadLanguages('purebasic');
        loadLanguages('python');
        loadLanguages('q');
        loadLanguages('qml');
        loadLanguages('r');
        loadLanguages('reasonml');
        loadLanguages('rib');
        loadLanguages('roboconf');
        loadLanguages('routeros');
        loadLanguages('rsl');
        loadLanguages('ruby');
        loadLanguages('ruleslanguage');
        loadLanguages('rust');
        loadLanguages('sas');
        loadLanguages('scala');
        loadLanguages('scheme');
        loadLanguages('scilab');
        loadLanguages('scss');
        loadLanguages('shell');
        loadLanguages('smali');
        loadLanguages('smalltalk');
        loadLanguages('sml');
        loadLanguages('sqf');
        loadLanguages('sql');
        loadLanguages('stan');
        loadLanguages('stata');
        loadLanguages('step21');
        loadLanguages('stylus');
        loadLanguages('subunit');
        loadLanguages('swift');
        loadLanguages('taggerscript');
        loadLanguages('tap');
        loadLanguages('tcl');
        loadLanguages('tex');
        loadLanguages('thrift');
        loadLanguages('tp');
        loadLanguages('twig');
        loadLanguages('typescript');
        loadLanguages('vala');
        loadLanguages('vbnet');
        loadLanguages('vbscript-html');
        loadLanguages('vbscript');
        loadLanguages('verilog');
        loadLanguages('vhdl');
        loadLanguages('vim');
        loadLanguages('x86asm');
        loadLanguages('xl');
        loadLanguages('xml');
        loadLanguages('xquery');
        loadLanguages('yaml');
        loadLanguages('zephir');
    })

    return {
        slideSelector: ".document>.slidebar>.slidepnl",
        titleSelector: ".document>.main .maintitle",
        containerSelector: ".document>.main .maindoc",
        copyrightSelector: ".document>.copyright",

        loadConfig: function (url) {
            $.get(url).then(function (data) {
                if (data.title) {
                    document.title = data.title;
                    window.app.title = data.title;
                    window.app.titleEle.html(data.title);
                }
                if (window.app.copyrightEle.length) {
                    window.app.copyrightEle.find(">span:eq(0)").html(data.copyright + " | by " + data.author + ". | V" + data.version);
                }

                window.app.copyrightEle.find("a.mddemo").click(function () {
                    loadmd("docs/mddemo.md");

                    window.app.slider.find("li>a.active").closest("li").find(">ul").remove();
                    window.app.slider.find("li>a.active").closest("li").find(">span.toggle").remove();
                    window.app.slider.find("li>a.active").removeClass("active");
                    document.title = "MD文档示例 - " + window.app.title
                });

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
    }
})();