const fetch = require('node-fetch');

const GITHUB_REPO = 'https://api.github.com/repos/thaiminhnguyen1999/HiTV/contents/';
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

export default async (req, res) => {
    try {
        const response = await fetch(GITHUB_REPO, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.log('Error details:', errorDetails); // Log lỗi chi tiết
            return res.status(response.status).send('Error fetching repository content from GitHub.');
        }

        const data = await response.text(); // Lấy dữ liệu dưới dạng text
        console.log('Raw Data:', data); // Log dữ liệu thô trước khi phân tích cú pháp
        const jsonData = JSON.parse(data); // Phân tích cú pháp dữ liệu thô thành JSON

        const filteredData = jsonData.filter(file =>
            !['api/file-tree.js', 'public/index.html', 'public/content.html', 'vercel.json', 'package.json', 'package-lock.json'].includes(file.path)
        );

        res.json(buildFileTree(filteredData));
    } catch (error) {
        console.error('Error fetching or parsing repository content:', error); // Log lỗi
        res.status(500).send('Error fetching repository content');
    }
};

function buildFileTree(items) {
    const fileTree = {};
    items.forEach(item => {
        if (item.type === 'dir') {
            fileTree[item.name] = {};
        } else {
            fileTree[item.name] = item.path;
        }
    });
    return fileTree;
}
