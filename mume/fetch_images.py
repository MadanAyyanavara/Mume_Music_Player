import urllib.request
import re

req = urllib.request.Request('https://iconscout.com/illustrations/search-not-found', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    urls = re.findall(r'"(https://cdni\.iconscout\.com/illustration/[^\"]+\.png)"', html)
    for u in set(urls):
        print(u)
except Exception as e:
    print('Error:', e)
