#!/usr/bin/env python
# encoding: utf-8

import requests
import random
import sys
from bs4 import BeautifulSoup
reload(sys)
sys.setdefaultencoding('utf8')
requests.adapters.DEFAULT_RETRIES = 5

file_name = 'ieee.xml'

file_content = ''  # 最终要写到文件里的内容
articles_begin = '\n' + '<articles>' + '\n'
articles_end = '</articles>' + '\n'

headers = [
    {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:34.0) Gecko/20100101 Firefox/34.0'},
    {'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'},
    {'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'},
    {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0'}
]

def get_abstract_ieee(url):
    f = open(file_name, 'a')
    file_content = ''
    source_code = ''
    loop_times = 0
    while loop_times < 5:
        try:
            source_code = requests.get(url,headers=random.choice(headers))  #为URL传递参数
            if source_code != '' and source_code.status_code == 200:
                break
        except requests.exceptions.ConnectionError:
            print 'try ' + str(loop_times+1) + ' times to open this article, filed!'
        finally:
            loop_times += 1
            if loop_times == 5:
                print 'Warning: Loop over 5 times on this article: ' + url

    if source_code.status_code == 200:
        plain_text = source_code.text     #获得整个html页面
        soup = BeautifulSoup(plain_text, "html.parser")  # 得到列表的soup对象

        file_content += articles_begin
        file_content += '<url>' + url + '</url>' + '\n'

        if soup.find('meta',{'name':'citation_abstract_html_url'}):
            abstract_html_url = soup.find('meta',{'name':'citation_abstract_html_url'})
            abstract_html_url = dict(abstract_html_url.attrs)['content']
            file_content += '<abstract_html_url>' + abstract_html_url + '</abstract_html_url>' + '\n'
        else:
            print 'no abstract_html_url'
        if soup.find('meta',{'name':'citation_pdf_url'}):
            pdf_url = soup.find('meta',{'name':'citation_pdf_url'})
            pdf_url = dict(pdf_url.attrs)['content']
            file_content += '<pdf_url>' + pdf_url + '</pdf_url>' + '\n'
        else:
            print 'no pdf_url'
        if soup.find('meta',{'name':'citation_doi'}):
            doi = soup.find('meta',{'name':'citation_doi'})
            doi = dict(doi.attrs)['content']
            file_content += '<doi>' + doi + '</doi>' + '\n'
        else:
            print 'no doi'
        if soup.find('meta',{'name':'citation_title'}):
            title = soup.find('meta',{'name':'citation_title'})
            title = dict(title.attrs)['content']
            file_content += '<title>' + title + '</title>' + '\n'
            print title + '\n'
        else:
            print 'no title'
        if soup.find('meta',{'name':'citation_publisher'}):
            publisher = soup.find('meta',{'name':'citation_publisher'})
            publisher = dict(publisher.attrs)['content']
            file_content += '<publisher>' + publisher + '</publisher>' + '\n'
        else:
            print 'no publisher'
        if soup.find('meta',{'name':'citation_journal_title'}):
            journal_title = soup.find('meta',{'name':'citation_journal_title'})
            journal_title = dict(journal_title.attrs)['content']
            file_content += '<journal_title>' + journal_title + '</journal_title>' + '\n'
        else:
            print 'no journal_title'
        if soup.find('meta',{'name':'citation_volume'}):
            volume = soup.find('meta',{'name':'citation_volume'})
            volume = dict(volume.attrs)['content']
            file_content += '<volume>' + volume + '</volume>' + '\n'
        else:
            print 'no volume'
        if soup.find('meta',{'name':'citation_issue'}):
            issue = soup.find('meta',{'name':'citation_issue'})
            issue = dict(issue.attrs)['content']
            file_content += '<issue>' + issue + '</issue>' + '\n'
        else:
            print 'no issue'
        if soup.find('meta',{'name':'citation_firstpage'}):
            first_page = soup.find('meta',{'name':'citation_firstpage'})
            first_page = dict(first_page.attrs)['content']
            file_content += '<first_page>' + first_page + '</first_page>' + '\n'
        else:
            print 'no first_page'
        if soup.find('meta',{'name':'citation_lastpage'}):
            last_page = soup.find('meta',{'name':'citation_lastpage'})
            last_page = dict(last_page.attrs)['content']
            file_content += '<last_page>' + last_page + '</last_page>' + '\n'
        else:
            print 'no last_page'
        if soup.find('meta',{'name':'citation_issn'}):
            issn = soup.find('meta',{'name':'citation_issn'})
            issn = dict(issn.attrs)['content']
            file_content += '<issn>' + issn + '</issn>' + '\n'
        else:
            print 'no issn'
        if soup.find('meta',{'name':'citation_date'}):
            date_of_publication = soup.find('meta',{'name':'citation_date'})
            date_of_publication = dict(date_of_publication.attrs)['content']
            file_content += '<date_of_publication>' + date_of_publication + '</date_of_publication>' + '\n'
        else:
            print 'no date_of_publication'

        if soup.findAll('meta',{'name':'citation_author'}):
            authors = soup.findAll('meta',{'name':'citation_author'})
            for author in authors:
                author = dict(author.attrs)['content']
                file_content += '<author>' + author + '</author>' + '\n'
        else:
            print 'no authors'
        if soup.find('meta',{'name':'citation_author_institution'}):
            institution = soup.find('meta',{'name':'citation_author_institution'})
            institution = dict(institution.attrs)['content']
            file_content += '<institution>' + institution + '</institution>' + '\n'
        else:
            print 'no institution'
        if soup.find('meta',{'name':'citation_keywords'}):
            keywords = soup.find('meta',{'name':'citation_keywords'})
            keywords = dict(keywords.attrs)['content'].strip(';').replace('\n','').split(';')
            for keyword in keywords:
                file_content += '<keyword>' + keyword.strip() + '</keyword>' + '\n'
        else:
            print 'no keywords'

        # get abstract
        conf_list = soup.find('div',{'id':'articleDetails'})
        if conf_list.find('div',{'class':'article'}):
            abstract = conf_list.find('div',{'class':'article'}).get_text().strip()
            file_content += '<abstract>' + abstract + '</abstract>' + '\n'
        else:
            print 'no abstract'

        # get references
        references_url = 'http://ieeexplore.ieee.org' + soup.find('a',{'id':'abstract-references-tab'})['href']
        source_code = ''
        loop_times = 0
        while loop_times < 5:
            try:
                source_code = requests.get(references_url,headers=random.choice(headers))  #为URL传递参数
                if source_code != '' and source_code.status_code == 200:
                    break
            except requests.exceptions.ConnectionError:
                print 'Warning: Loop over 5 times to open reference_url' + references_url
            finally:
                loop_times += 1
                if loop_times == 5:
                    print 'Loop over 5 times to open reference_url: ' + references_url

        if source_code.status_code == 200:
            plain_text = source_code.text     #获得整个html页面
            soup = BeautifulSoup(plain_text, "html.parser")  # 得到列表的soup对象
            conf_list = soup.find('div',{'id':'abstractReferences'})

            if conf_list.find('li'):
                for conf in conf_list.findAll('li'):
                    reference = ''
                    for ref in conf.stripped_strings:
                        ref = ref.strip()
                        ref = ref.replace('\t','')
                        ref = ref.replace('\n','')
                        if(ref.startswith('Abstract') or ref.startswith('[CrossRef]' or ref.startswith('| Full Text:'))):
                            break
                        else:
                            reference += ref.strip()
                    file_content += '<reference>' + reference + '</reference>' + '\n'
            else:
                print 'no references'
        else:
             print 'Request error not 200 when get reference'
        file_content += articles_end + '\n'
        f.write(file_content)
        f.close()
    else:
        print 'Request error not 200'