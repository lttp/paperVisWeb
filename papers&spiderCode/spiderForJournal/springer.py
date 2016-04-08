#!/usr/bin/env python
# encoding: utf-8

import requests
import random
import sys
from bs4 import BeautifulSoup
reload(sys)
sys.setdefaultencoding('utf8')
requests.adapters.DEFAULT_RETRIES = 5

file_name = 'springer.xml'
file_content = ''  # 最终要写到文件里的内容
articles_begin = '\n' + '<articles>' + '\n'
articles_end = '</articles>' + '\n'

headers = [
    {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:34.0) Gecko/20100101 Firefox/34.0'},
    {'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'},
    {'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'},
    {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0'}
]

def get_abstract_springer(url):
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
        if soup.find('meta',{'name':'citation_fulltext_html_url'}):
            fulltext_html_url = soup.find('meta',{'name':'citation_fulltext_html_url'})
            fulltext_html_url = dict(fulltext_html_url.attrs)['content']
            file_content += '<fulltext_html_url>' + fulltext_html_url + '</fulltext_html_url>' + '\n'
        else:
            print 'no fulltext_html_url'
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
        if soup.find('meta',{'name':'citation_journal_abbrev'}):
            journal_abbrev = soup.find('meta',{'name':'citation_journal_abbrev'})
            journal_abbrev = dict(journal_abbrev.attrs)['content']
            file_content += '<journal_abbrev>' + journal_abbrev + '</journal_abbrev>' + '\n'
        else:
            print 'no journal_abbrev'
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
        if soup.findAll('meta',{'name':'citation_issn'}):
            issns = soup.findAll('meta',{'name':'citation_issn'})
            print_issn = dict(issns[0].attrs)['content']
            online_issn = dict(issns[1].attrs)['content']
            file_content += '<print_issn>' + print_issn + '</print_issn>' + '\n'
            file_content += '<online_issn>' + online_issn + '</online_issn>' + '\n'
        else:
            print 'no issns'
        if soup.find('meta',{'name':'citation_online_date'}):
            online_date = soup.find('meta',{'name':'citation_online_date'})
            online_date = dict(online_date.attrs)['content']
            file_content += '<online_date>' + online_date + '</online_date>' + '\n'
        else:
            print 'no online_date'
        if soup.find('meta',{'name':'citation_cover_date'}):
            cover_date = soup.find('meta',{'name':'citation_cover_date'})
            cover_date = dict(cover_date.attrs)['content']
            file_content += '<cover_date>' + cover_date + '</cover_date>' + '\n'
        else:
            print 'no cover_date'

        # get authors, institutions, emails
        authors = soup.findAll('meta',{'name':'citation_author'})
        for author in authors:
            author = dict(author.attrs)['content']
            file_content += '<author>' + author + '</author>' + '\n'
        author_institutions = soup.findAll('meta',{'name':'citation_author_institution'})
        for author_institution in author_institutions:
            author_institution = dict(author_institution.attrs)['content']
            file_content += '<author_institution>' + author_institution + '</author_institution>' + '\n'
        author_emails = soup.findAll('meta',{'name':'citation_author_email'})
        for author_email in author_emails:
            author_email = dict(author_email.attrs)['content']
            file_content += '<author_email>' + author_email + '</author_email>' + '\n'

        # get abstract
        conf_list = soup.find('div',{'id':'article'})
        if conf_list.find('section',{'id':'Abs1'}):
            abstract_tag = conf_list.find('section',{'id':'Abs1'})
            abstract = ''
            try:
                abstract = abstract_tag.find('p').get_text().strip()
            except AttributeError:
                for abstract_list in abstract_tag.findAll('div',{'class':'Para'}):
                    abstract += abstract_list.get_text().strip()
            file_content += '<abstract>' + abstract + '</abstract>' + '\n'
        else:
            print 'no abstract'

        # get topics, keywords
        conf_list = conf_list.find('div',{'id':'abstract-about'})
        article_info = conf_list.find('div',{'class':'summary'})

        topic_info = article_info.find('ul',{'class':'abstract-about-subject'})
        if topic_info:
            for conf in topic_info.findAll('a'):
                topic = conf.get_text().strip()
                file_content += '<topic>' + topic + '</topic>' + '\n'
        else:
            print 'no topics'

        keyword_info = article_info.find('ul',{'class':'abstract-keywords'})
        if keyword_info:
            for conf in keyword_info.findAll('li'):
                keyword = conf.get_text().strip()
                file_content += '<keyword>' + keyword + '</keyword>' + '\n'
        else:
            print 'no keywords'

        # get references
        references = soup.find('ol',{'class':'BibliographyWrapper'})
        if references:
            for conf in references.findAll('div',{'class':'CitationContent'}):
                reference = conf.get_text().strip()
                reference = reference.replace('\t','')
                reference = reference.replace('\n','')
                reference = reference.replace('CrossRef','')
                file_content += '<reference>' + reference + '</reference>' + '\n'
        else:
            print 'no references'

        file_content += articles_end + '\n'
        f.write(file_content)
        f.close()
    else:
        print 'Request error not 200'

