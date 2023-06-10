1. Requirements

2. Настройка и установка git (Links(1)):
    Create file .gitignore (внести .idea и node_modules)

    git init
    git add .
    git commit -m 'initial'
    git branch -M main
    git remote add origin https://github.com/EpsWeb/test.git
    git push -u origin main

    git checkout -b 'webpack'
    Create file webpack.config.js
    git add .
    git commit -m 'create webpack config'
    git push -u origin webpack

    Show on github site changes in branches 'main' and 'webpack'

3. Настройка окружения (npm  и webpack)
    npm -v
    node -v
    Если их нет, надо установить
    * Сказать, что webpack работает на node
    npm init
    Открыть сайт webpack => Guides => Getting started
    npm install webpack webpack-cli --save-dev
 
    Создаём папку src, в ней файл index.js с `console.log('Working')`
    Заполняем `webpack.config.js`:
        const path = require('path')
        module.exports = {
            context: path.resolve(__dirname, 'src'),
            mode: 'development',
            entry: './index.js',
            output: {
                filename: 'bundle.js',
                path: path.resolve(__dirname, 'dist')
            }
        }

    В папке src создаём файл module.js, в нём console.log('Module')
    В index.js делаем import './module', чтобы проверить работу webpack
    В package.json создаём комманды:
        "start": "webpack",
        "build": "webpack --mode production"

    * Если после этого при запуске npm start есть ошибка, типа webpack is unknown command,
    то надо установить webpack глобально:
    `npm i webpack webpack-cli`

    `npm start`
    После этого должна появиться файл dist/bundle.js

    Написать в консоли node dist/bundle.js, чтобы проверить выполнение этого сгенерированного файла
    
    npm run build
    После этой комманды файл bundle.js должен быть минимизированный, показать это, выполнив:
    `node dist/bundle.js`

    В `.gitignore` добавить `dist`

    Добавить:
        resolve: {
            extensions: ['.js'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@core': path.resolve(__dirname, 'src/core')
            }
        }

4. Установка плагинов
    Они добавляются в массив plugins в webpack.config
    Показать как добавляются hash (bundle.js поменять на bundle.[hash].js и сбилдить проект)
    Объяснить что такое hash. Это для того, чтобы когда пользователь заходит на сайт, браузер понимал, что вышла новая версия и скачивал именно её

    1 плагин - HtmlWebpackPlugin
        Зайти на сайт wepback, найти его, установить: 
            `npm install --save-dev html-webpack-plugin`
        Настраиваем его - {template: 'index.html'}. Это файл, с которого он будет брать html. Context - src, поэтому просто index.html
    2 плагин - CopyWebpackPlugin (чтобы переносить favicon, тоже на сайте)
        Воруем favicon с сайта https://www.google.com/sheets/about/ (в консоли взял ссылку на favicon)
        `webpack.config.js`:
            const CopyPlugin = require("copy-webpack-plugin");
            В массив plugins добавляем:
                `
                    new CopyPlugin({
                        patterns: [
                            {
                                from: path.resolve(__dirname, "src/favicon.ico"),
                                to: path.resolve(__dirname, "dist"),
                            },
                        ],
                    }),
                `
        В src/index.html в <head></head> Добавляем <link rel="shortcut icon" href="favicon.ico">
        Всё, теперь он будет брать её и добавлять в папку dist

    3 плагин - clean-webpack-plugin (загуглить, взять с сайта npm. Он чистит папку dist каждый раз)

5. Установка лоадеров 
    1 лоадер - `MiniCssExtractPlugin` (чтобы выносить css из js в отдельный файл) * На сайте webpack
    настраиваем его ({filename: 'bundle.[hash].css'})
    2 лоадер - sass-loader
        Устанавливаем с сайта webpack. Чтобы проверить создаём файл `src/scss/index.scss` с scss кодом:
        `
            $red: red;

            body {
                background: $red;
            }
        `
        Делаем import './scss/index.scss' в index.js
        Собираем проект, как следствие, появится новый файл с переведённым валидным css. Показать, что без sass-loader он будет не валидный
    3 лоадер - `babel-loader`
    Перейти на сайт babeljs => setup => webpack
    Устанавливаем:
        `npm install --save-dev babel-loader @babel/core @babel/preset-env`
    Добавляем как на сайте в webpack.config:
    `
        {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                },
            },
        },
    `
    Смотрим на сайте `@preset-env`, там есть настройки `"browserslist": "> 0.25%, not dead"`. Вносим их в `package.json`
    Чтобы проверить, подключён ли babel, пишем в файле module.js асинхронную функцию
    `
        async function start() {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts");
            const posts = await response.json();
            console.log("posts", posts);
        }

        start();
    `
    
     `npm start`
     Проверяем всё ли ок

     На всякий случай добавим "@babel/polyfill" (хотя он, вроде, уже включено, но на всякий)
        На сайте babel ищем babel/polyfill, устанавливаем:
            `npm install --save @babel/polyfill`
        `wepback.config` меняем:
            `entry: ["@babel/polyfill", "./index.js"],`

6. Добавление режимов сборки:
    * Обычно режим хранится в переменной NODE_ENV.
    `wepback.config.js`:
        `
            const isProd = process.env.NODE_ENV === 'production'
            const isDev = !isProd
        `
    Но в разных системах может отличаться, поэтому, чтобы быть уверенными за эту переменную, установим паект `cross-env`
        `npm i cross-env -D`
    `package.json`:
        `
            "start": "cross-env NODE_ENV=development webpack",
            "build": "cross-env NODE_ENV=production webpack --mode production"
        `
    `wepback.config.js`:
        `
            console.log('Is prod', isProd);
            console.log('process.env.NODE_ENV', process.env.NODE_ENV);
        `
    `npm run start, npm run build`. Смотрим в консоли на значение этих переменных. Всё ок, удаляем консоли логи.
    * Переменная isProd нужна для того, чтобы задать разные значения `webpack.config` в зависимомти от режима сборки.
    Например, hash мы хотим добавлять только в режиме `production`
    Для этого пишем функцию filename:
        `const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;`
    Меняем в `wepback.config.js` "bundle.[hash].css" => filename("css") и "bundle.[hash].js" => filename("js")
    `npm run start, npm run build`: Смотрим, что в prod сборке названия с хэшем, в dev - нет.
    Добавление source-map:
        `wepback.config.js`:
            devtool: isDev ? 'source-map' : false,
    `npm run start, npm run build`: Смотрим, что в prod сборке нет source-maps, в dev - есть.
    Webpack-dev-server: Сайт `webpack`: Documentation => Configuration => DevServer:
        `npm install webpack-dev-server --save-dev`
    `package.json`:
        `"start": "cross-env NODE_ENV=development webpack-dev-server --open",`
    `wepback.config.js`: (Берём с сайта, гнемного меняем)
    `
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            hot: isDev,
            port: 3000,
        },
    `
    `npm run start`. Нас выкидывают на `localhost:3000`. Меняем color на blue, видим изменения в watch-режиме, радуемся.

7. EsLint
    `npm i eslint eslint-loader babel-eslint -D`
    `webpack.config`: module.rules, который .js меняем лоадер, который там сейчас на функцию jsLoaders()
    Создаём сверху 
    `
        const jsLoaders = () => {
        const loaders = [
            {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"],
            },
            },
        ];

        if (isDev) {
            loaders.push("eslint-loader");
        }

        return loaders;
        };
    `
    Создаём в корне файл `.eslintrc`. В нём:
    `
        {
            "parser": "babel-eslint",
            "env": {
                "es6": true,
                "browser": true,
                "node": true
            },
            "extends": [
                
            ]
        }
    `   

    Также создаём файл `.eslintignore`. Пока пустой
    * Можно всё настраивать самому, но лучше воспользоваться готовым пресетом. например, google-eslint. Это пакет, содержащий в себе базокую конфигурацию, который google считает нужным для JS style-guide
    Гуглим eslint-google, открываем сайт npm:
        `npm i eslint-config-google -D`
        С этого сайта берём как использовать (в файл `.eslintrc`):
            `"extends": ["eslint:recommended", "google"]` 
    Сейчас VS Code должен давать много ошибок о том, что его не устраивает. Смотри что за ошибки и добавляем правила в
     `.eslintrc`:
        "rules": {
            "arrow-parens": "off",
            "linebreak-style": "off",
            "object-curly-spacing": "off",
            "require-jsdoc": "off",
            "semi": "off",
            "quotes": "off"
        },
    Возможно, тут надо закрыть и открыть проект заново, чтобы настройки eslint применились.
    `npm run start`. Радуемся, что всё ок.
    Файл `module.js` удаляем. Из `index.js` удаляем его импорт.
    Также изменим тут default fromatter. Зайдём в настройки, поиск 'eslint'. Поставим чекбокс в true у 'Enable EsLint as formatter'.
    После этого правая кнопка мыши => Format document with => Configure default formatter => Eslint. 
    * Теперь при нажатии  Shift+Alt+F форматировании будет согласно eslint
    На этом настройка webpack завершена. Радуемся этому!