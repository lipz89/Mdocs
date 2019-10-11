> 利用`markdown`语法编写文档，并渲染成页面，形成站点，本文档介绍当前网站维护介绍

### 文档结构
![文档结构](/images/oths/struct.png)
#### 简单说明
```
--根
  |--docs // 所有文档存放目录，
  |--highlight // 文档代码语法高亮支持模块
  |--images // 所有文档中需要使用的图片资源
  |--jsons // 主要文档目录文件夹
  |--merge // 文档合并结果目录
     |--merge.py // 合并文档的python脚本，此项不需要发布到发布目录
  |--script // 当前站点依赖的javascript脚本
  |--styles // 当前站点依赖的css样式表
  |--favicon.ico // 当前站点图标
  |--index.html //当前站点主页
```
`merge.py`脚本执行后生成对应文档的合并版`md`文件
可通过`markdown`的扩展生成对应的html/pdf/iamge文件
合并生成PDF后的merge目录结构如下：
![文档结构](/images/oths/struct2.png)
#### 站点工作原理
>在首页定义本站点包含的文档
``` js
    var docs = [
        {
            name: "物资云接口文档",
            config: "wzy.json"
        },
        {
            name: "LiteFramework框架说明",
            config: "fx.json"
        },
        {
            name: "耗材物资云文档",
            config: "dmsp.json"
        }
    ]
    window.app.init(docs);
```
>以上定义了三个文档，每个文档指定了一个`json`文件作为文档目录定义(见下文)，针对每个文档在`docs`和`images`目录分别对应一个文件夹。
>站点将以上三个文档渲染成三个文档入口连接，单击连接后站点会从对应的`json`文件加载目录结构渲染到页面，点击目录即可查看对应的文档。

### 目录组织
```json
{
    "title": "LiteFramework框架说明",
    "version": "1.0.0",
    "author": "lpz",
    "copyright": "©2019, 快享医疗.",
    "menus": [
        {
            "title": "简介",
            "file": "docs/fx/instruction.md"
        },
        {
            "title": "框架核心",
            "listtype": "circle",
            "items": [
                {
                    "title": "框架核心简介",
                    "file": "docs/fx/core/info.md"
                },
                {
                    "title": "框架依赖",
                    "file": "docs/fx/core/dependency.md"
                },
                {
                    "title": "AppInstance",
                    "file": "docs/fx/core/appinstance.md"
                }
            ]
        },
        {
            "title": "服务核心",
            "listtype": "circle",
            "items": [
                {
                    "title": "框架依赖",
                    "file": "docs/fx/server/dependency.md"
                },
                {
                    "title": "IService",
                    "file": "docs/fx/server/iservice.md"
                }
            ]
        },
        {
            "title": "插件",
            "listtype": "circle",
            "items": [
                {
                    "title": "简介",
                    "file": "docs/fx/plugins/info.md"
                },
                {
                    "title": "已提供插件",
                    "file": "docs/fx/plugins/list.md"
                }
            ]
        },
        {
            "title": "部分核心技术实现详细说明",
            "listtype": "circle",
            "items": [
                {
                    "title": "简介",
                    "file": "docs/fx/details/info.md"
                },
                {
                    "title": "已提供插件",
                    "file": "docs/fx/details/list.md"
                }
            ]
        }
    ]
}
```
#### 目录效果
![目录效果](/images/oths/menus.png)

#### 目录定义说明
>- title - 目录显示文本
>- file - 目录对应文档，只有目录的叶子节点可指定此项
>- items - 子目录 
>- listtype - 子目录列表样式，限定UL标签的list-style-type样式枚举值
### 图片引用
![图片引用](/images/oths/img1.png)
![图片引用2](/images/oths/img2.png)

### 添加文档流程
>1. 在要添加的文档目录结构中合适的位置添加目录节点
>2. 在`docs`目录中对应的文档目录中添加`md`文件
>3. 编辑`md`文件
>4. 如果`md`文件中需要图片资源，将文件资源放置到`images`目录中对应的文档目录中
>5. 将所有添加和修改的文件提交到发布目录