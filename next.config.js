const isProd = process.env.NODE_ENV === 'production';
const repoName = 'spent'; // Your repository name

module.exports = {
  assetPrefix: isProd ? `/${repoName}/` : '',
  basePath: isProd ? `/${repoName}` : '',
};
