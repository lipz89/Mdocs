import os
import sys
import json
import random
import string
import time

mpath = os.path.abspath(os.path.dirname(__file__))
path = os.path.abspath(os.path.join(mpath, ".."))
jsondir = os.path.abspath(os.path.join(path, 'jsons'))
pageBreaker = '<div STYLE="page-break-after: always;"></div>\n'


def readmd(file, title, result):
    file = path + '\\' + file.replace('/', '\\')
    print("合并", file)
    result['texts'] = result['texts'] + [title]
    if not os.path.exists(file):
        print('文件不存在：', file)
        return

    with open(file, 'r', encoding='utf8') as mdtext:
        result['texts'] = result['texts'] + mdtext.readlines()
        result['texts'] = result['texts'] + ['\n']


def readmenus(menus, result,  preIndex=''):
    index = 1
    for item in menus:
        if 'title' in item:
            indexstr = preIndex+str(index)
            title = item['title']
            id = ''.join(random.sample(string.ascii_letters, 8))
            titlemark = '<h2 id="' + id + '">' + indexstr + ' ' + title + '</h2>\n\n'
            titlelink = '<h4><a href="#' + id + '" title="' + \
                title + '">' + indexstr + ' ' + title + '</a></h2>\n'
            result['titles'] = result['titles'] + [titlelink]
            if 'file' in item:
                readmd(item['file'], titlemark, result)
            elif 'items' in item:
                result['texts'] = result['texts'] + [titlemark]
                submenus = item['items']
                readmenus(submenus, result, indexstr + '.')
            index += 1


def getInfo(result):
    infos = []
    if 'author' in result:
        infos.append('|作者|' + result['author'] + '|\n')
    if 'version' in result:
        infos.append('|版本|' + result['version'] + '|\n')
    if 'copyright' in result:
        infos.append('|版权|' + result['copyright'] + '|\n')
    now = time.localtime()
    now = time.strftime('%Y-%m-%d %H:%M:%S', now)
    infos.append('|修订时间|' + now + '|\n')
    if len(infos) > 0:
        infos.insert(1, '|:--|--:|\n')
    return infos


def merge(result, file):
    menus = result['menus']
    docTitle = result['title']
    titles = ['<h1 style="text-align:center">' + docTitle + '</h1>\n\n']

    infos = getInfo(result)
    if len(infos):
        titles = titles + infos

    titles.append(pageBreaker)
    mergeResult = {
        'titles': titles,
        'texts': []
    }
    readmenus(menus, mergeResult)
    with open(file, 'w', encoding='utf8') as f:
        f.writelines(mergeResult['titles'])
        f.writelines([pageBreaker])
        f.writelines(mergeResult['texts'])


def getJson(jsonFile):
    jsonPath = jsondir + '\\' + jsonFile
    print('读取文档信息：', jsonPath)
    with open(jsonPath, 'r', encoding='utf8') as jsonText:
        lines = jsonText.readlines()
        result = json.loads(''.join(lines))
        targetFile = mpath + '\\' + jsonFile.replace('.json', '.md')
        merge(result, targetFile)
        print('生成文档完成：', targetFile)
        print(' ')


if __name__ == "__main__":
    getJson('dmsp.json')
    # getJson('fx.json')
    # getJson('wzy.json')
