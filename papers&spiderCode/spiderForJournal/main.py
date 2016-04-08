#!/usr/bin/env python
# encoding: utf-8

from ieee import get_abstract_ieee
from springer import get_abstract_springer
from acm import get_abstract_acm


file_content = ''
file_name_proceedings = 'journal_queue_test.txt'
f = open(file_name_proceedings,'r')
line = f.readline()

f2 = open('other_urls.txt','a')

while line:
    print line.strip()
    if line == '\n':
        line = f.readline()
        continue
    url = line.strip()
    if url[0:26] == 'http://ieeexplore.ieee.org' or url[0:25] == 'http://dx.doi.org/10.1109':
        get_abstract_ieee(url)
    elif url[0:25] == 'http://dx.doi.org/10.1007' or url[0:24] == 'http://link.springer.com':
        get_abstract_springer(url)
    elif url[0:17] == 'http://dl.acm.org' or url[0:26] == 'http://doi.acm.org/10.1145' \
            or url[0:25] == 'http://dx.doi.org/10.1145':
        get_abstract_acm(url)
    else:
       f2.write(url)
    line = f.readline()
f.close()
f2.close()