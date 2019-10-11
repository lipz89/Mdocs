
## 标题
>使用不同数量的#来定义标题
>`Markdown` 支持两种标题的语法，`Setext`形式和`Atx`形式
>`Setext` 形式是用底线的形式，利用 =（最高阶标题）和 -（第二阶标题）
>`Atx` 形式在行首插入 1 到 6 个 # ，对应到标题 1 到 6 阶。

### 代码
```md
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
最高阶标题
=========
第二阶标题
---------

```
### 效果

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
最高阶标题
=========
第二阶标题
---------

---
## 表格
>这里使用`|`，`-`，`:`来创建一个表格。
>其中`|`用于画表格中的竖线，`-`用于划分每个格子所占宽度，`:`用于定义对齐方式。
>无`:`自动，左边`:`左对齐，右边`:`右对齐，两边都有`:`居中对齐
### 代码
```md
|项目|价格|数量|产地|标记|
|----|---:|--:|:---|:--:|
|computer|$1600|12|China||
|phone|$120|20|USA|-|
```
### 效果

|项目|价格|数量|产地|标记|
|----|---:|--:|:---|:--:|
|computer|$1600|12|China||
|phone|$120|20|USA|-|

---

## 有序列表
>使用一般的数字接着一个英文句点作为项目标记，数字不能省略但可无序，点号之后的空格不能少
### 代码
```md
1. 列表一
	1. 子列表一
2. 列表二
3. 列表三
```

### 效果

1. 列表一
	1. 子列表一
2. 列表二
3. 列表三
---

## 无序列表
>使用`*`,`-`或`+`来做为列表的项目标记
### 代码
```md
- 列表一
 - 列表二
	- 子列表一
		- 子列表二
	- 子列表三
```

### 效果

- 列表一
 - 列表二
	- 子列表一
		- 子列表二
	- 子列表三
---

## 任务列表

### 代码
```md
- [ ] 计划任务
- [x] 已经完成的任务
```
### 效果

- [ ] 计划任务
- [x] 已经完成的任务
---

## 代码
>行内代码：在行内使用反引号<code>\`</code>（～键）包围代码，或使用`<code></code>`包围
>多行代码：使用前后各3个反引号来标记，在前面的三个反引号后面标明语言，如`cs`，`java`，`html`，`json`，等
### 代码
```md
```cs
    [Serializable]
    public class WebApiSetting : ISetting
    {
        public string Host { get; set; }
        public List<LoginUser> Users { get; set; }
        public static string FileName { get; } = "WebAPI.json";
    }

以上是<code>C#</code>的示例代码，其中用到了`class`关键字
```

### 效果

```cs
    [Serializable]
    public class WebApiSetting : ISetting
    {
        public string Host { get; set; }
        public List<LoginUser> Users { get; set; }
        public static string FileName { get; } = "WebAPI.json";
    }
```
以上是<code>C#</code>的示例代码，其中用到了`class`关键字

---

## 转义字符
>特殊符号前可以加反斜线`\`表示转义

### 代码
```md
\\ 反斜杠
\` 反引号
\* 星号
\_ 下划线
\{\} 大括号
\[\] 中括号
\(\) 小括号
\# 井号
\+ 加号
\- 减号
\. 英文句号
\! 感叹号
```

### 效果

\\ 反斜杠
\` 反引号
\* 星号
\_ 下划线
\{\} 大括号
\[\] 中括号
\(\) 小括号
\# 井号
\+ 加号
\- 减号
\. 英文句号
\! 感叹号

---

## 横线
>三个或更多`-`,`_`,`*`，必须单独一行，可含空格（注意如果在文字后使用`---`，则为副标题）

### 代码
```md
---
-----
___
***
```

### 效果

---
-----
___
***
---

## 引用
>使用`>`符号标记，可以嵌套
>或者使用`tab`键缩进
### 代码
```md
> This is a question.
>> This is a sub question.
>>      这是一个缩进引用
```

### 效果

> This is a question.
>> This is a sub question.
    这是一个缩进引用
---

## 删除线、加粗及斜体等其他
>使用`~~ ~~`来定义一根删除线。
>使用`** **`或`__ __`来让字体加粗。
>使用`* *`或`_ _`来让字体变成斜体。
>使用`== ==`来标记文本。
>使用`~ ~`定义下标，`^ ^`定义一个上标。
>这些标记可以混合使用，只要前后成对。
>使用`\<br\>`标签换行
### 代码
```md
<del> 我是被删除的 </del>
~~It is false.~~
**There is a question.**
__There is a question.__
*There is a question.*
_There is a question._
==Attention!==
水的化学式是H<sub>2</sub>O。
2<sup>10</sup>=1024。
***加粗的斜体.***

```

### 效果
<del> 我是被删除的 </del>
~~It is false.~~
**There is a question.**
__There is a question.__
*There is a question.*
_There is a question._
==Attention!==
水的化学式是H<sub>2</sub>O。
2<sup>10</sup>=1024。
***加粗的斜体.***

---

## 字体
>向输入文本前加上一句`<font color=red>`即可让文字颜色变成红色。
>加入`<font size=4>`来改变字号。
>加入`<font face="仿宋">`来让字体变为仿宋字。
>以上三种可以混在一起用
>字体一旦设置，就会生效到文档末尾，除非后面有另外的设置。
### 代码
```md
<font color=red>This is a question.
<font color=blue>This is a question.
<font color=black>This is a question.
<font color=orange>This is a question.
<font size=1>This is a question.
<font size=2>This is a question.
<font size=6>This is a question.
<font size=7>This is a question.
<font face="仿宋">我是一句话。
<font face="楷体">我是一句话。
<font face="宋体">我是一句话。
<font color=red><font size=3><font face="仿宋">我是3号红色仿宋字体。
<font color=black><font size=4><font face="宋体">我是4号黑色宋体字。
```

### 效果

<font color=red>This is a question.
<font color=blue>This is a question.
<font color=black>This is a question.
<font color=orange>This is a question.
<font size=1>This is a question.
<font size=2>This is a question.
<font size=6>This is a question.
<font size=7>This is a question.
<font face="仿宋">我是一句话。
<font face="楷体">我是一句话。
<font face="宋体">我是一句话。
<font color=red><font size=3><font face="仿宋">我是3号红色仿宋字体。
<font color=black><font size=4><font face="宋体">我是4号黑色宋体字。

---

## 链接与图片
>在 `Markdown` 中，插入链接不需要其他按钮，你只需要使用\[显示文本\]\(链接地址\) 这样的语法即可
>图片在前面有个!别忘了

### 代码
```md
文字超链：[百度](http://www.baidu.com)
索引超链：[百度][1]
图片：![博客园logo](https://www.cnblogs.com/images/logo_small.gif)

自动链接：http://www.google.com   
邮箱链接：<northpolecan@xx.com>
[1]:http://www.baidu.com
```

### 效果

文字超链：[百度](http://www.baidu.com)
索引超链：[百度][1]
图片：![博客园logo](https://www.cnblogs.com/images/logo_small.gif)

自动链接：http://www.google.com   
邮箱链接：<northpolecan@xx.com>
[1]:http://www.baidu.com

---

## 锚点
>我在本节点开头定义了一个：<a name="divtop">跳转目标锚点</a>
>不能实现的就用html实现即可

### 代码
```md
我在本节点开头定义了一个：<a name="divtop">跳转目标锚点</a>
我们跳转过去：[跳转本节点开头](#divtop)
```

### 效果

我们跳转过去：[跳转本节点开头](#divtop)

---