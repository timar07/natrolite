const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
        mode: 'development',
        entry: './src/initApp.ts',
        target: 'electron-main',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.ts$/,
                    include: /src/,
                    use: [{ loader: 'ts-loader' }]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
            ]
        },
        resolve: {
            extensions: ['.ts', '.js', '.json']
        },
        output: {
            path: __dirname + '/dist',
            filename: 'initApp.js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/render/ui/index.html'
            })
        ]
    }
];