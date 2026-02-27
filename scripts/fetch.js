const fs = require('fs');
fetch('https://iconscout.com/illustrations/search-not-found')
    .then(res => res.text())
    .then(html => {
        const urls = html.match(/https:\/\/cdni\.iconscout\.com\/illustration\/[^\"]+\.png/g);
        const unique = [...new Set(urls)];
        fs.writeFileSync('urls.txt', unique.join('\n'));
        console.log('Done, saved to urls.txt. Count:', unique.length);
    })
    .catch(console.error);
