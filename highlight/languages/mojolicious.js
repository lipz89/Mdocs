/*
Language: Mojolicious
aliases: mojolicious
Requires: xml.js, perl.js
Author: Dotan Dimet <dotan@corky.net>
Description: Mojolicious .ep (Embedded Perl) templates
Category: template
*/
hljs.registerLanguage('mojolicious',function(hljs) {
  return {
    subLanguage: 'xml',
    contains: [
      {
        className: 'meta',
        begin: '^__(END|DATA)__$'
      },
    // mojolicious line
      {
        begin: "^\\s*%{1,2}={0,2}", end: '$',
        subLanguage: 'perl'
      },
    // mojolicious block
      {
        begin: "<%{1,2}={0,2}",
        end: "={0,1}%>",
        subLanguage: 'perl',
        excludeBegin: true,
        excludeEnd: true
      }
    ]
  };
});
