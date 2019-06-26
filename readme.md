## 使用说明

1. 首先配置根目录中的`config.json`配置文件，其中包含站点信息，和菜单信息，代码如下：

```json
{
    "title": "接口定义",
    "version": "1.0.0",
    "author": "author",
    "copyright": "©2019, company.",
    "menus": [
        {
            "title": "首页",
            "file": "docs/index.md"
        },
        {
            "title": "分类1",
            "listtype": "circle",
            "items": [
                {
                    "title": "子类1",
                    "file": "docs/type1/test1.md"
                },
                {
                    "title": "子类2",
                    "file": "docs/type1/test2.md"
                }
            ]
        },
        {
            "title": "分类2",
            "listtype": "circle",
            "items": [
                {
                    "title": "子类3",
                    "file": "docs/type2/test3.md"
                },
                {
                    "title": "子类4",
                    "file": "docs/type2/test4.md"
                }
            ]
        },
        {
            "title": "附录",
            "listtype": "decimal",
            "items": [
                {
                    "title": "数据字典",
                    "file": "docs/appendix/dic.md"
                },
                {
                    "title": "数据格式",
                    "file": "docs/appendix/fmt.md"
                }
            ]
        }
    ]
}

```

2. 分别编辑菜单中所有项目指向的md源文件，如下：
```md
## 示例文档1
> 这只是一个示例文档
```
3. 然后用服务器（比如nginx）把站点挂起来就行了，

*. 常用md语法在本站最下面的`md示例`链接中有说明，更详细语法请自行学习。
*. 本站md解析使用[markedjs](https://github.com/markedjs/marked)，语法高亮使用[highlightjs](https://highlightjs.org/)