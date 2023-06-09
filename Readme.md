1. Requirements

2. Настройка и установка git (Links(1)):
    Надо завести аккаунт на `github`
    Заходим на сайт `github` => `new repository`

    Create file .gitignore (внести .idea и node_modules)

    git init
    git add .
    git commit -m 'initial'
    git branch -M main
    git remote add origin https://github.com/EpsWeb/test.git
    git push -u origin main

    * Теперь создадим ветку `webpack`
 
    git checkout -b 'webpack'
    Create file webpack.config.js
    git add .
    git commit -m 'create webpack config'
    git push -u origin webpack

    Show on github site changes in branches 'main' and 'webpack'

3. Настройка окружения (npm  и webpack)
    `npm -v`
    `node -v`
    Если их нет, надо установить
    * Сказать, что webpack работает на node
    `npm init`
    Открыть сайт `webpack => Guides => Getting started`
    `npm install webpack webpack-cli --save-dev`
 
    Создаём папку `src`, в ней файл `index.js` с `console.log('Working')`
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

    В папке `src` создаём файл `module.js`, в нём `console.log('Module')`
    В `index.js` делаем `import './module'`, чтобы проверить работу webpack
    В `package.json` создаём комманды:
        "start": "webpack",
        "build": "webpack --mode production"

    * Если после этого при запуске `npm start` есть ошибка, типа `webpack is unknown command`,
    то надо установить webpack глобально:
    `npm i webpack webpack-cli`

    `npm start`
    После этого должна появиться файл `dist/bundle.js`

    Написать в консоли `node dist/bundle.js`, чтобы проверить выполнение этого сгенерированного файла
    
    `npm run build`
    После этой комманды файл `bundle.js` должен быть минимизированный, показать это, выполнив:
    `node dist/bundle.js`

    Видим в консоли консоль логи, это значит, что production-сборка работает

    В `.gitignore` добавить `dist`

    Добавить:
        resolve: {
            extensions: ['.js'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@core': path.resolve(__dirname, 'src/core')
            }
        }
3. 1. Установка плагинов
    Они добавляются в массив `plugins` в `webpack.config`
    Показать как добавляются `hash` (`bundle.js` поменять на bundle.[hash].js и сбилдить проект)
    Объяснить что такое `hash`. Это для того, чтобы когда пользователь заходит на сайт, браузер понимал, что вышла новая версия и скачивал именно её

    1 плагин - `HtmlWebpackPlugin`
        Зайти на сайт wepback, найти его, установить: 
            `npm install --save-dev html-webpack-plugin`
        Настраиваем его - `{template: 'index.html'}`. Это файл, с которого он будет брать html. Context - `src`, поэтому просто `index.html`
        Создаём файл `src/index.html`. Внутри:
            `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Pure JS excel</title>
                </head>
                <body>
                    <div id="app" class="container"></div>
                </body>
                </html>
            `
        `npm run start`
        Видим `bundle.js` - шлавный скрипт. С хэшем. Внутри html с подключённым скриптом
    2 плагин - `CopyWebpackPlugin` (чтобы переносить `favicon`, тоже на сайте)
        Воруем `favicon` с сайта `https://www.google.com/sheets/about/` (в консоли взял ссылку на favicon)
        `webpack.config.js`:
            `const CopyPlugin = require("copy-webpack-plugin");`
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
        В `src/index.html` в <head></head> Добавляем <link rel="shortcut icon" href="favicon.ico">
        Всё, теперь он будет брать её и добавлять в папку dist

    3 плагин - `clean-webpack-plugin` (загуглить, взять с сайта npm. Он чистит папку dist каждый раз, добавить его в массив `plugins`)

    4 плагин - `MiniCssExtractPlugin` (чтобы выносить css из js в отдельный файл) * На сайте `webpack`
    Настраиваем его `({filename: 'bundle.[hash].css'})`
3. 2. Установка лоадеров 
    1 лоадер - `sass-loader`
        Устанавливаем с сайта webpack. 
        `npm install sass-loader sass webpack --save-dev`
        * Для него нужен ещё `css-loader`, его тоже устанавливаем
        Псоле этого добавляем в `webpack.config.js`:
            `
                module: {
                    rules: [
                    {
                        test: /\.s[ac]ss$/i,
                        use: [
                            MiniCssExtractPlugin.loader,
                            "css-loader",
                            "sass-loader",
                        ],
                    },
                    ],
                },
            `
        Чтобы проверить создаём файл `src/scss/index.scss` с scss кодом:
        `
            $red: red;
            body {
                background: $red;
            }
        `
        Делаем import `./scss/index.scss` в `index.js`
        Собираем проект, как следствие, появится новый файл с переведённым валидным css. Показать, что без `sass-loader` он будет не валидный
    2 лоадер - `babel-loader`
    Перейти на сайт `babeljs => setup => webpack`
    Устанавливаем:
        `npm install --save-dev babel-loader @babel/core @babel/preset-env`
    Добавляем как на сайте в `webpack.config`:
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
    Чтобы проверить, подключён ли babel, пишем в файле `module.js` асинхронную функцию
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

     На всякий случай добавим `"@babel/polyfill"` (хотя он, вроде, уже включено, но на всякий)
        На сайте babel ищем babel/polyfill, устанавливаем:
            `npm install --save @babel/polyfill`
        `wepback.config` меняем:
            `entry: ["@babel/polyfill", "./index.js"],`

3. 3. Добавление режимов сборки:
    * Обычно режим хранится в переменной `NODE_ENV`.
    `wepback.config.js`:
        `
            const isProd = process.env.NODE_ENV === 'production'
            const isDev = !isProd
        `
    Но в разных системах может отличаться, поэтому, чтобы быть уверенными за эту переменную, установим пакет `cross-env`
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
    * Переменная `isProd` нужна для того, чтобы задать разные значения `webpack.config`у в зависимости от режима сборки.
    Например, hash мы хотим добавлять только в режиме `production`
    Для этого пишем функцию filename:
        `const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;`
    Меняем в `wepback.config.js` "bundle.[hash].css" => filename("css") и "bundle.[hash].js" => filename("js")
    `npm run start, npm run build`: Смотрим, что в prod сборке названия с хэшем, в dev - нет.
    Добавление `source-map`:
        `wepback.config.js`:
            `devtool: isDev ? 'source-map' : false,`
        * Подробней про `devTool` на `сайте webpack => Documentation => Configuration => DevTool`
    `npm run start, npm run build`: Смотрим, что в prod сборке нет source-maps, в dev - есть.

    `Webpack-dev-server`: Сайт webpack: `Documentation => Configuration => DevServer:`
        `npm install webpack-dev-server --save-dev`
    `package.json`:
        `"start": "cross-env NODE_ENV=development webpack-dev-server --open",`
    `wepback.config.js`: (Берём с сайта, немного меняем)
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

3. 4. EsLint
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
    * Можно всё настраивать самому, но лучше воспользоваться готовым пресетом. например, `google-eslint`. Это пакет, содержащий в себе базокую конфигурацию, который google считает нужным для JS `style-guide`
    Гуглим `eslint-google`, открываем сайт npm:
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
    Возможно, тут надо закрыть и открыть проект заново, чтобы настройки `eslint` применились.
    `npm run start`. Радуемся, что всё ок.
    Файл `module.js` удаляем. Из `index.js` удаляем его импорт.
    Также изменим тут `default fromatter`. Зайдём в настройки, поиск `eslint`. Поставим чекбокс в `true` у `Enable EsLint as formatter`.
    После этого правая кнопка мыши => Format document with => Configure default formatter => Eslint. 
    * Теперь при нажатии  `Shift+Alt+F` форматировании будет согласно eslint
    На этом настройка webpack завершена. Радуемся этому!
3. 5. Git flow.
    `git add .`
    `git commit -m 'Finish project config'`
    `git push -u origin webpack` (Или просто `git push`. Проверить, проканает ли, если нет, то полную комманду с `-u origin`)

    Идём на сайт гитхаба:
        Мы там в ветке `main`, код старый. Переключаемся на ветку `webpack`, видим изменённый код.
        * Хотим смёржить ветки, кликаем на `Compare & pull request`. Там стрелочкой показано, что мы заливаем ветку `webpack` в `main`.
        Оставляем комментарий `Added webpack and 2 modes for development and production`
        * Там справа `Reviewers`, показать, что есть такие, их можно добавлять но в этом проекте никого.
        Переходим на сам проект, там во вкладке `Pull-requests` теперь `1`. Заходим туда. Там видны коммиты, что было изменено. Заходим на большой коммит `Finish...` Делаем поиск по `semi` Осталяем комментарий у `"semi": "off"`: "Почему нет точек с запятой?".
        Возвращаемся на наш pull-requst. Обращаем внимание на кнопку `Merge pull request`:
        * `Squash and merge` означает скомбинировать все коммиты в один. Rebase - rebase :)
        Нажимаем `Merge pull request`, `Confirm merge`
        Всё, теперь ветки смёрджины. Переходим на ветку `main`, радуемся обновлённому коду.
        Переходим на ветку `main`:
            `git checkout main`
            `git pull`
        Круто, теперь мы соединили ветки, закончили с настройкой `webpack` и можем идти дальше.
        * Теперь мы от ветки `main` будем создавать другие ветки и работать в них. Ветку `webpack` на этом моменте удаляют, так как она больше не нужна. Но мы не будем.

4. Вёрстка (https://docs.google.com/spreadsheets/u/0/)
    
4. 1. Планирование:
    Сайт будет сожержать 2 страницы
    Первая (страница таблицы): 
        Нажимаем на `+` (создание таблицы), страница самой таблицы (имя на диаграмме - `Excel`). Сверху - header с инпутом названия таблицы и двумя кнопками справа - закрытие таблицы и удаление таблицы.
        Ниже - туллбар с кнопочками. Мы сделаем не все, но основные.
        Ниже - блок с формулой.
        Ниже - сама таблица
    Вторая (главная, Dashboard)
    Содержание (сверху вниз):
        Header - название
        Кнопка `+` - создать таблицу
        Таблица таблиц
4. 2. Создание струкутры css
    Создаём новую ветку и переходим в неё:
        `git checkout -b css-layout`
    Гуглим normalize css (это либа, показывающая одинаково стили во всех браузерах)
        `npm install normalize.css`
        В `index.scss` вставляем (если там что-то есть, удаляем всё):
            `@import "~normalize.css";`
    Подключаем шрифт `Roboto`:
        Гуглим `Roboto font`. Переходим на `https://fonts.google.com/specimen/Roboto`
        Вставляем первой строчкой в `index.scss`:
            `@import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,100;1,700;1,900&    family=Roboto:wght@100;300&family=Rubik:ital,wght@1,300&display=swap");`
        Всё, подключили. 
    Задаём body шрифт `Roboto` (если он вдруг не загрузится, то по дефолту `sans-serif`):
        `
        body {
                font-family: 'Roboto', sans-serif;
            }
        `
    И другие стили:
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        } 
        body {
            font-family: 'Roboto', sans-serif;
            font-size: 12px;
            }

        .excel {
            position: relative;
        }
    Начнём `со` страницы Excel (1):
        Там 4 элемента (header, toolbar, formula, table - далее `компоненты`). Для каждого из них создадим scss-файл (а также `_variables.scss` и `_mixins.scss`).
        В файлы компонентов делаю импорт переменных и миксинов:
            `
                @import "variables";
                @import "mixins";
            `
        Делаем import scss всех компонентов в `index.scss`:
        `
            @import "header.scss";
            @import "toolbar.scss";
            @import "formula.scss";
            @import "table.scss";
        `
    * Будем задавать стили по системе BEM. Идём на сайт getbem, смотрим примеры. В этом проекте мы частично будем использовать BEM, чтобы названия классов не были слишком длинными
    `index.html`:
        `
            <div id="app" class="container">

                <div class="excel">

                    <div class="excel__header"></div>
                    <div class="excel__toolbar"></div>
                    <div class="excel__formula"></div>
                    <div class="excel__table"></div>

                </div>

            </div>
        `
    В scss-файл каждого компонента вставляем имя класса. Например:
        `
            .excel__header {
                
            }
        `

4. 3. Стили для header:
    Тут удобно будет использовать `display: flex,  justify-content: space-between` 
    Нам нужны иконки для кнопок:
    Гуглим `material icons`. Где-то пятая ссылка ведёт на гитхаб. Там внизу копируем `link`:
        `<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">`. Вставляем в `<header></header>` `index.html`
    На сайте `fonts.google.com` ищем `exit to app` и `delete`, копируем, меняем вёрстку в `index.html`:
        * `
            <div class="excel__header">

                <input type="text" class="input" value="New table">

                <div>
                    <div class="button">
                        <span class="material-icons">
                            delete
                        </span>
                    </div>
                    
                    <div class="button">
                        <span class="material-icons">
                            exit_to_app
                        </span>
                    </div>
                </div>

            </div>
        `
    `npm start`. Видим, что элементы появились, но нет стилей. Добавим их. Сначала подумаем какие. Сама таблица будет скроллэбл. Остальные вещи - Header, Toolbar, Formula будут всегда наверху на одном и том же месте. Поэтому сделаем их `position absolute`, прибитые по краям, один под другим.
    `_variables.scss`:
        `$header-height: 34px;`
    `_header.scss`:
    * `
        .excel__header {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            height: $header-height;
            padding: 8px 4px 0;
            display: flex;
            justify-content: space-between;

            //temp

            background-color: antiquewhite;

            & .input {
                margin: 0;
                padding: 2px 7px;
                min-width: 1px;
                color: #000;
                border: 1px solid transparent;
                border-radius: 2px;
                height: 20px;
                font-size: 18px;
                line-height: 22;
                outline: none;

                &:hover {
                    border: 1px solid $border-color;
                }

                &:focus {
                    border: 2px solid #1a73e8;
                }
            }

            & .button {

            }
        }
    `
    temp background даём, чтобы видеть, где находится наш хэдер.
    У инпута и ячеек бордер будет одного цвета, поэтому вынесем в переменную:
        `_variables`: 
            ` $border-color: #c0c0c0;`
    Удаляем временый background-color.
    Кнопки справа будут такие же, как и  в туллбаре, только разнах цветов. Поэтому сделаем для этого миксин.
    Смотрим в браузере, радуемся, что всё ок. Дальше - Toolbar.

4. 4. Стили для Toolbar:
    `__variables.scss`:
         `$toolbar-height: 40px;`
     `toolbar.scss`:
        * `
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: $toolbar-height;
            // temp
            background-color: aqua;
        `
        * Если мы так и оставим top: 0, то туллбар будет на том же месте, что и header. Поэтому дадим `top: $header-height;`
        Удаляем temp background-color
        Ищем иконки: Сайт `fonts.google.com` (или в поиске `material icons`) => Material icons, filled => Поиск по категориям => `Text formatting` => Берём иконки: `format_align_left`, `format_align_center`, `format_align_right`, `format_bold`, `format_italic`, `format_underlined`. Вставляем в html => в класс `excel__toolbar`
4. 5. Стили для Formula
    `index.html` => class=`excel__formula`: 
        `
            <div class="info">fx</div>
            <div class="input" contenteditable></div>
        `
        * `contenteditable` у дива делаем его инпутом, но без инпутовских стилей. Т.е. то, что нам нужно. 
        Сейчас, если начнём вводить некорректные слова, они будут подчеркнутф красным. Это `spellcheck`. Чтобы его отключить, добавим к `contenteditable spellcheck="false"`
    `variables.scss`:
        `$formula-height: 24px;`
        `$info-cell-width: 40px;`
    `formula.scss`:
        * `
            .excel__formula {
                position: absolute;
                left: 0;
                right: 0;
                top: $header-height + $toolbar-height;
                height: $formula-height;
                display: flex;
                align-items: center;
                border-bottom: 1px solid $border-color;

                .info {
                    font-size: 18px;
                    font-style: italic;
                    font-weight: bold;
                    text-align: center;
                    border-right: 1px solid $border-color;
                    min-width: $info-cell-width;
                }
                
                .input {
                    padding: 4px;
                    font-size: 12px;
                    outline: none;
                    width: 100%;
                    height: 100%;
                    color: #000;
                }
            }
        `

    Снйчас цвет шрифта черноват. Добавим общий цвет шрифта. 
        `index.scss`:
            `
                .excel {
                    position: relative;
                    color: #888;   // Эту строку сейчас добавили
                }
            `
4. 6. Стили для Таблицы
    Тут есть строчки и колонки. Так мы их и разобьём. Первая строчка специфическая, там буквы. Её сделаем отдельно, а остальные - типовые.
    `index.html`:
        * `
        <div class="excel__table">
                <div class="row">
                    <div class="row-info"></div>
                    <div class="row-data">
                        <div class="column">A</div>
                        <div class="column">B</div>
                        <div class="column">C</div>
                    </div>
                </div>
                <div class="row">
                    <div class="row-info">1</div>
                    <div class="row-data">
                        <div class="cell selected" contenteditable>A1</div>
                        <div class="cell" contenteditable>B1</div>
                        <div class="cell" contenteditable>C1</div>
                    </div>
                </div>
                <div class="row">
                    <div class="row-info">2</div>
                    <div class="row-data">
                        <div class="cell selected" contenteditable>A2</div>
                        <div class="cell" contenteditable>B2</div>
                        <div class="cell" contenteditable>C2</div>
                    </div>
                </div>
            </div>
        `
    `variables.scss`:
        `$row-height: 24px;`
        `$cell-width: 120px;`
    `table.scss`:
        * `
            .excel__table {
                position: absolute;
                left: 0;
                right: 0;
                top: $header-height + $toolbar-height + $formula-height;
                overflow-x: auto;
                .row {
                    display: flex;
                    min-height: 20px;
                    height: $row-height;
                }
                .row-info {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: $info-cell-width;
                    height: 100%;
                    border: 1px solid $border-color;
                    background-color: #f8f9fa;
                    border-top: none;
                }
                .row-data {
                    display: flex;
                }
                .column {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #f8f9fa;
                    min-width: 40px;
                    width: $cell-width;
                    border: 1px solid $border-color;
                    border-top: none;
                    border-left: none;
                    height: 100%;
                }
                .cell {
                    min-width: 40px;
                    padding: 5px;
                    width: $cell-width;
                    height: 100%;
                    border: 1px solid #e2e3e3;
                    border-top: none;
                    border-left: none;
                    color: #111;
                    white-space: nowrap;
                    &.selected {
                        border: none;
                        outline: 2px solid #3c74ff;
                        z-index: 2;
                    }
                }
            }
        `
        Во втором ряду не виден border-outline, поэтому добавим 
            `.excel__table`: `padding-bottom: 2px;`
    Уменьшим размер общий шрифта: `index.scss` => `.excel` => `font-size: .8rem;`
    Удалим класс `selected` у дивас контентом `A2`
    Смотрим на то, что вышло. При клике на ячейки появляется outline. Поэтому добавим:
        `table.scss` => `.cell`: `outline: none;`
    * В дальнейшем мы будем программно добавлять outline по клиу на ячейку с помощью класса `selected`
    Проверим скролл. Для этого продублируем дивы колонок с контентом `A, B, C` много раз и посмотрим на прекрасный горизонтальный скролл. Заметим, что скроллится только таблица. Header, Toolbar и Formula не скроллятся, стоят на месте.
    На этом всёрска этой (1) страницы закончена. Далее следующая страница.

4. 7. Вёрстка страницы 2 (Dashboard)
    * Перенесём всё содержимое файла `index.html` в отдельный файл (`src/assets/excel.html`), чтобы он у нас был, а мы пока удалим всё в `index.html` и будем там делать следующую страницу (и последнюю, их всего две).
    В главном файле `index.html` оставим только главный див:
        `<div id="app"></div>`
    * Посмотрим на диаграмму этой страницу, нанесём начальную вёрстку:
    * `
        <div id="app">
            <div class="db">
                <div class="db__header">
                </div>
                <div class="db__new">
                </div>
                <div class="db__table">
                </div>
            </div>
        </div>
    `
    Создадим файл `src/scss/dashboard.scss`. В нём дадим стили:
        `
            @import "variables";
            @import "mixins";

            .db {
            &__header {
                position: fixed;
                left: 0;
                right: 0;
                top: 0;
                height: $db-header-heigth;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #fff;
                box-shadow: 0 2px 5px 2px rgba(60, 64, 67, 0.15);
                z-index: 1000;
            }
            &__new {
                margin-top: $db-header-heigth;
                padding: 1.5rem;
                background-color: #daecd0;
            }
            &__table {
            }
            }

        `

    `_variables.scss`: Добавим `$db-header-heigth: 64px;`
    `index.scss`: Добавим `@import "dashboard.scss";`
    Добавим вёрстку:
        `
            <div class="db__header">
                <h1>Excel Dashboard</h1>
            </div>
            <div class="db__new">
                <a href="#" class="db__new__create">
                    New <br> Table
                </a>
            </div>
        `
    Глянем, как и что, и пойдём дальше.
    Добавим стили в `dashboard.scss`:
        `
            &__create {
                width: 160px;
                height: 160px;
                background-color: #fff;
                border-radius: 4px;
                border: 1px solid #dadce0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
                text-decoration: none;
                color: #000;
                text-align: center;
                transition: all .1s ease;

                &:hover {
                    color: green;
                    border-color: green;
                }
            }
        `
    Cсылка с New table сейчас приклеена к левому краю. Этого не хочется. Поэтому обернём его в див с классом db__view и зададим ему кое-какие стили:
        `index.html`:
            * `
                <div class="db__new">
                    <div class="db__view">
                        <a href="#" class="db__new__create">
                            New <br> Table
                        </a>
                    </div>
                </div>
            `
        `dashboard.scss` (внутри `.db {}`):
            `
                &__view {
                    max-width: 1000px;
                    margin: 0 auto;
                }
            `
    Смотрим в браузере, как всё круто, радуемся.
    Теперь верстаем список таблиц.
    * `index.html`:
        `
            <div class="db__table db__view">
                <div class="db__table__header">
                    <span>Name</span>
                    <span>Date of opening</span>
                </div>
            </div>
        `
    * `dashboard.scss`:
        `
            &__table {
                padding: 1rem;

                &__header {
                    display: flex;
                    justify-content: space-between;
                    color: #202124;
                    font-weight: 500;
                    font-size: 16px;
                    margin-bottom: 10px;
                    padding: 0 12px;
                }
            }
        `
    Name и Date of opening разошлись по разным сестам, всё ок.
    Теперь сделаем список таблиц
        * `index.html`:
            `
                <div class="db__table__header">
                    <span>Name</span>
                    <span>Date of opening</span>
                </div>
                <ul class="db__table__list">
                    <li class="db__table__list__record">
                        <a href="#">Table number 1</a>
                        <strong>12.12.2023</strong>
                    </li>
                </ul>
            `
        * Список у нас ul и li. Уберём все дефолтные стили у этих элементов. Сделаем для этого миксин, потому что это частая практика.
            * `_mixins.scss`: 
                `
                    @mixin clear-list() {
                        list-style: none;
                        margin: 0;
                        padding: 0;
                    }
                `
        * `dashboard.scss`:
            `
                &__record {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 14px 12px 16px;

                    &:hover {
                        background-color: #e6f4ea;
                        border-radius: 25px;
                    }

                    a { 
                        text-decoration: none;
                        color: #202124;
                        font-size: 14px;

                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            `
        Сделаем ещё один элемент таблицы, чтобы посмотреть как когда их несолько
            * `index.html`: 
                `
                    <li class="db__table__list__record">
                        <a href="#">Table number 2</a>
                        <strong>1.1.2023</strong>
                    </li>
                `
    Всё, на этом вёрстка этой страницы завершена. Смотрим в браузере как всё прекрасно, радуемся!
    Вынесем в отдельный файл вёрстку. 
        Создадим файл `src/assets/dashboard.html`. Скопипастим туда всё содержимое `index.html`. Из самого же `index.html` удалим всё, оставив только 
            `
                <body>
                    <div id="app">
                    </div>
                </body>
            `
    Теперь разберёмся с гитом. Остановим build-процесс в консоли и зальём изменения в удалённый репозиторий и смёрджимся с основной веткой.
        `git add .`
        `git commit -m 'Finish css layout'`    // Эти вещи можно сделать через VS Code
        `git push -u origin css-layout`
    Идём на сайт гитхаб. В наш репозиторий. Видим, что появилась ветка `css-layout`.
    `Compare and pull request`
    `Create pull request`
    `Merge pull request`
    `Confirm merge`
    Всё, в master-ветке видим наши изменения, радуемся, какие мы красавы!
    `git checkout main`
    `git pull`
    Получили все изменения в ветку main локально.

5. Создание фреймворка.
    5. 1. Создадим новую ветку, в которой мы будем разрабатывать фреймворк. Назовём её `framework-start`
        `git checkout -b 'framework-start'`
    Рисуем общую диграмму наследования (`High order diagram.drawio`)
    Все 4 компонента страницы будут наследоваться от класса `ExcelComponent`, ктоорый будет наследоваться от класса `DomListener`
    Эти 4 компонента будут входить в общего родителя-класс `Excel`
    `index.html`: удалим console.log
    * Теперь наконец приступим к логике, js. Для начала создадим базовую сткуктуру классов
    * В `webpack.config` мы создавали alias `@core` -> `src/core`. Поэтому создадим папку `src/core`. В ней будем хранить основные вещи. Классы мы будем создавать с большой буквы, остальные вещи - с маленькой.

    * Создадим файл `src/core/DomListener.js`. В нём:
        `
            export class DomListener {
                        
            }

        `
    EsLint ругается на `no-trailing-spaces`. Поэтому добавлю в `.eslintrc` => `"no-trailing-spaces": "off",`
    * Теперь создадим файл `src/core/ExcelComponent.js`, который будет наследоваться от класса `DomListener`:
        `
            import { DomListener } from "./DomListener";

            export class ExcelComponent extends DomListener {
            // возвращает шаблон компонета
            toHTML() {
                    return "";
                }
            }

        `
    Теперь создадим файл `src/components/excel/Excel.js`. Это будет сама страница Excel.

    Мы хотим, чтобы в `index.js` файле мы стартанули наше приложение строчкой `new Excel()`. ** Добавляем эту строчку в файл.
    * Поправим немного, добавив параметры, которые будут нужны для отображения компонентов - селектор, куда их класть и список самих компонентов.
        `
            const excel = new Excel('#app', {
                components: [],
            })

            console.log('Excel', excel);
        `
    * `Excel.js`:
        `
            export class Excel {
            constructor(selector, options) {
                this.$el = document.querySelector(selector)
                this.components = options.components
                }
            }

        `
    * Теперь создадим сами компоненты. Первый - `Header`. Создаём файл `src/components/header/Header.js`. Можно было бы назвать его `HeaderComponent`. Но у нас их будет не так много, и, пожалуй, это лишнее. Мы и так поймём, что это за Header. 
        `Header.js`:
            `
                import { ExcelComponent } from "@core/ExcelComponent";
                export class Header extends ExcelComponent {
                }

            `
    Аналогично создаём классы `Toolbar, Formula, Table`
    Теперь зарегистрируем эти компоненты в их родительском классе `Excel`.
        * `index.js`:
            `
                const excel = new Excel('#app', {
                    components: [Header, Toolbar, Formula, Table],
                })
            `
        * Передаём не инстансы, а просто классы
        Теперь класс `Excel` знает, какие компоненты у него присутствуют и может начать складывать их в шаблон. Для этого реализуем метод `render`. Метод `render` обычно говорит о том, что мы что-то складываем в шаблон. Сначала выведем там в консоли, что такое `$el`, чтобы убедиться, что всё у нас пока корректно. `console.log` там удалим.
            * `Excel.js`:
                `
                    export class Excel {
                        constructor(selector, options) {
                            this.$el = document.querySelector(selector);
                            this.components = options.components;
                        }

                        render() {
                            console.log(this.$el);
                        }
                    }
                `
            * `index.js`:
                `
                    const excel = new Excel('#app', {
                        components: [Header, Toolbar, Formula, Table],
                    })

                    excel.render()
                `
    * Теперь мы хотим в метода `render` добавлять элементу `$el` наши компоненты. Сначала положим туда тестовый элемент, чтобы проверить, добавится ли он:
        * `Excel.js`:
            `
                render() {
                    this.$el.insertAdjacentHTML('afterbegin', `<h1>Test</h1>`)
                }
            `
        `npm start`
        Смотрим в браузере слово `Test`, радуемся тому, что элемент добавился.
    Теперь добавим в `$el` результат метода `toHTML()` каждого компонента. Для удобства и минимизации метода `render()` вынесем создание главного элемента, который мы засунем в `$el` в отдельный метод `getRoot()`
        * `Excel.js`:
            `
                getRoot() {
                    const $root = document.createElement('div')
                    
                    this.components.forEach(Component => {
                        const component = new Component()
                        $root.insertAdjacentElement('beforeend', component.toHTML())
                    });

                    return $root
                }

                render() {
                    this.$el.append(this.getRoot())
                }
            `
    Надо только переопределить метод `toHTML()` для каждого компонента, чтобы он возвращал что-то вменяемое:
        * `Header.js`:
            `
                export class Header extends ExcelComponent {
                    toHTML() {
                        return '<h1>Header</h1>'
                    }
                }
            `
        * То же самое делаем в компонентах `Formula, Toolbar, Table`
    Смотрим в консоли вывод этих 4-ёх компонентов, радуемся!
    * Теперь посмотрим на файл `excel.html`. У главного дива есть класс `excel`. У остальных тоже классы типа `excel__header`. Мы должны следовать этому стайл-гайду, чтобы наша вёрстка не отличалась от той, что хранится в файле `excel.html`.
    Для этого добавим по статическому полю `className` в каждый из компонентов.
        * Например, в `Header.js` это будет так выглядеть: `static className="excel__header"`
        * А в `Excel.js` добавим так: `$root.classList.add('excel')`

    * Поговорим о классе `DomListener`. Это класс, который будет отвечать за добавление листенеров. И, конечно, ему надо знать на какой элемент ему надо эти листенеры навесить. Поэтому ему в конструктор мы дадим `$root`-элемент, на который и будем вешать прослушку событий. И, если, его не будет, будем кидать ошибку.
        * `core/DomListener.js`: 
            `
                export class DomListener {
                    constructor($root) {
                        if (!$root) {
                            throw new Error('No root element provided for DomListenet!')
                        }

                        this.$root = $root
                    }
                }

            `
        Сейчас, если мы посмотрим в консоль, будет ошибка, так как мы этот `$root` не передаём. `DomListener` мы наследуем в классе `ExcelComponent`. Поэтому дадим его в этом конструкторе класса каждого компонента.
            * `Excel.js` :
                `
                    getRoot() {
                        const $root = document.createElement('div')
                        $root.classList.add('excel')
                        this.components.forEach(Component => {
                            const $el = document.createElement('div')
                            const className = Component.className
                            $el.classList.add(className)
                            const component = new Component($el)
                            $el.innerHTML = component.toHTML()
                            $root.append($el)
                        })
                        return $root
                    }
                `
            * Переделали мы немного тут структуру. Теперь мы создаём внутренний элемент `$el`, в который складываем `component.toHTML()`, и его добавляем, как элемент в главный `$root`
        * Смотрим в браузере структуру HTML. Радуемся правильным названиям классов у главного дива `excel` и шлавных классов каждого из компонентов.
        * Теперь перенесём вёрстку в компоненты. 
        * Покажу на примере `Header`: 
            В файл `Header.js` копипастим внутренности `<div class="excel__header">`.
        Аналогично с `Toolbar, Formula, Table`.
        * Смотрим в браузере, радуемся правильной вёрстке

        * Теперь порафакторим код. В классе `Excel.js` мы работаем с такими методами, как `document.createElement`, `classList.add`. Вынесем их в отдельный `healper`-класс.
            Создадим файл `core/Dom.js`. Это будет утилита, позволяющая проще взаимодействовать с dom-деревом. Аля свой jquery.
            `dom.js`:
                `
                    export class Dom {    
                    }
                    export function $() {
                        return new Dom()
                    }
                    $.create = (tagName, classes = '') => {
                        const el = document.createElement(tagName)
                    if (classes) {
                        el.classList.add(classes)
                    }
                        return el
                    }
                `
            Теперь воспользуемся этим новым классом `Dom` в классе `Excel`:
                `Excel.js`:
                    `
                        getRoot() {
                            const $root = $.create('div', 'excel')
                            this.components.forEach(Component => {
                                const $el = $.create('div', Component.className)
                                const component = new Component($el)
                                $el.innerHTML = component.toHTML()
                                $root.append($el)
                            })

                            return $root
                        }
                    `
            Теперь сделаем так, чтобы в конструктор `$` мы давали либо селектор, либо `dom`-ноду. Если селектор, то будем вызывать `document.querySelector`, если ноду- то её сразу записывать в переменную `$nativeElement` (*** в курсе эта переменная называется `$el`, но я переименовал, потому что возникает путаница с переменной `$el` из класса `Excel` ***):
                * `dom.js`:
                  `
                    export class Dom {    
                        constructor(selectorOrNode) {
                            this.$nativeElement = typeof selectorOrNode === 'string'
                                ? document.querySelector(selectorOrNode)
                                : selectorOrNode
                        }
                    }
                    export function $(selectorOrNode) {
                        return new Dom(selectorOrNode)
                    }
                    $.create = (tagName, classes = '') => {
                        const el = document.createElement(tagName)
                        if (classes) {
                            el.classList.add(classes)
                        }
                        return $(el)
                    }
                `
                    * Обратим внимание, что теперь мы возвращаем `$(el)`, а не просто `el`, как раньше. Чтобы Это был инстанс класса `Dom`, а не просто дом-нода.
            * Т.е. элемент класса `Dom` будет ассоциироваться с конкретной `Dom`-нодой

            Теперь сделаем метод `html`, который будет аналогичен методы `html` в `jquery`. Его суть: если мы передаём какой-то параметр в этот метод, то мы переписываем `innerHTML` элемента `$nativeElement`. Если ничего не передаём, то просто вернуть его `outerHTML`:
                `dom.js` -> внутри класса `Dom`:
                    `
                        html(html) {
                            if (typeof html === 'string') {
                                this.$nativeElement.innerHTML = html
                                return this
                            }
                            return this.$nativeElement.outerHTML.trim()
                        }
                        clear() {
                            this.html('')
                            return this
                        }
                    `
                        * Строка `return this` для того, чтобы мы могли чейнить. Т.е. писаьть код типа `$('div').html('<h1>test</h1>').clear()`. Это, кстати, популярный паттерн в js.
                    Теперь `Excel.js`:
                        `$el.html(component.toHTML())` вместо `$el.innerHTML = component.toHTML()`
            Смотрим в браузере, видим ошибку `$root.append is not a function`. Это потому что `$root` теперь у нас - эот элемент класса `Dom`, а не дом-нода. Тогда надо создать такой метод в классе `Dom`:
            `dom.js` -> внутри класса `Dom`:
                `
                    append(nodeOrDomObject) {
                        let node = nodeOrDomObject
                        if (nodeOrDomObject instanceof Dom) {
                            node = nodeOrDomObject.$nativeElement
                        }
                        this.$el.appendChild(node)
                        return this
                    }
                `
                * `return this` опять же для чейнинга.
            * Теперь переделаем все созданные ноды на объекты класса `Dom`:
                `Excel.js`:
                    `
                        constructor(selector, options) {
                            this.$el = $(selector);   // вместо document.querySelector(selector);
                            this.components = options.components;
                        }
                    `
        * Показать гибкость нашей структуры. В файле `index.js` мы можем просто удалить из массива `components` какой-то компонент. например, `Formula`. И его не будет на сайте.

        *** Теперь подумаем, как реализовать добавление листенеров через ООП ***
        Для этого у нас есть класс `DomListener`, у него есть функционал добавления и удаления слушателей. Посмотрим на диаграмме, мы это писали.
        Поэтому добавим 2 метода - `initDomListeners` и `removeDomListeners` (пока пустые).
        Сделаем пока на примере Формулы. К ней в конструктор надо добавить объект `options`, в котором будет информация о листенерах
            `Formula.js`:
                `
                    constructor($root) {
                        super($root, {
                            name: 'Formula',
                            listeners: ['input', 'click'],
                        })
                    }
                `
                * `Name` - это просто имя класса, чтобы легче бало отследить, где ошибка и прочее. И массив `listeners`. В нём будут перечислены все листенеры компонента. И конвенция наша такая, что если есть листененр, допустим `input`, значит, должен быть реализован метод `onInput`, в который мы передаём `event` и можем реагировать на это событие.
                    `DomListener`: 
                        `
                            export class DomListener {
                                constructor($root, listeners = []) {
                                    if (!$root) {
                                        throw new Error('No root element provided for DomListenet!')
                                    }
                                    this.$root = $root
                                    this.listeners = listeners
                                }
                                initDomListeners() {
                                }
                                removeDomListeners() {
                                }
                            }
                        `
                    `ExcelComponent`: 
                        `
                            constructor($root, options = {}) {
                                super($root, options.listeners)
                            }
                        `
            * Теперь надо подумать, где и когда вызывать метод  `initDomListeners`. Его надо вызывать тогда, когда загружен весь html. Иначе они не применятся. И вызывать его надо для каждого из компонентов. Надо выбрать централизованное место для всех компонентов. Это `ExcelComponent`. Реализуем там метод `init`:
                `ExcelComponent`:
                    `
                        init() {
                            this.initDomListeners()
                        }
                    `
        * Сейчас сделаем так, чтобы в классе `Excel` поле `components` было действительно экземплярами классов `Header`, `Formula`, ...
        Пока это просто функции. Выведем в кончоль, что такое `this.components`:
            `Excel.js`:

                `
                    render() {
                        this.$el.append(this.getRoot())
                        console.log('this.components', this.components);   // Видим, что это функции
                    }
            `
        * Теперь заменим `forEach` на `map`. В конце вернём  `return component`, не забудем. И в конце опять выведем в консоль
            `Excel.js`:
                `
                    this.components = this.components.map(Component => {
                        const $el = $.create('div', Component.className)
                        const component = new Component($el)
                        $el.html(component.toHTML())
                        $root.append($el)
                        return component
                    })
                    render() {
                        this.$el.append(this.getRoot())
                        console.log('this.components', this.components);   // Видим, что это функции
                    }
                `
            Круто. Видим, что сейчас это объекты классов `Header`, `Formula`, ... и радуемся нашей объектно-ориентированности.
            Теперь вызовем для каждого компонента метод `init()`
                `Excel.js`:
                    `
                        render() {
                            this.$el.append(this.getRoot())
                            this.components.forEach(component => component.init());
                        }
                    `
            Теперь в классе `DomListener` мы можем посмотреть что такое `listeners` у каждого компонента (т.к. теперь мы вызываем метод `initDomListeners` у каждого компонента):
                `DomListener`:
                    `
                        initDomListeners() {
                            console.log(this.listeners);
                        }
                    `
            Смотрим в консоль, видим, что в одном из них (у формулы) есть событие `input`. Теперь у этом методе будем описывать логику, касающуюся листенеров.
            
    5. 2. Добавление прослушки событий.
        * Сначала изобразим на диаграмме что конкретно мы хотим реализовать (диаграмма `Прослушка событий`).
        * Допустим, у нас есть какой-то компонент (например, формула). У неё должен быть какой-то листенер (например, 'input'). Formula наследуется от класса `ExcelComponent`. Но он нас сейчас не интересует, и его мы пропустим. А нарисуем сразу класс `DomListener`. Этот класс должен определить, что при срабатывании такого листенера (input), нужн определить метод `onInput` и вызывать его внутри самого класса Formula.
        Вспомним, что у каждого компонента есть элемент `$root`, и это главный `Dom`-элемент компонента.
        Т.е. в классе `DomListener` есть досьуп до элемента `$root`. И в этом классе мы будем вещать на листенеры вызов метода (например, на листенер `input` вызов метода `onInput`, который должен быть объявлен внутри класса компонента).
        Теперь сделаем это.
            Сначала добавим в файл `dom.js` метод `on(eventType, callback)`, в котором сделаем `addEventListener`
                `dom.js`
                    `
                        on(eventType, callback) {
                            this.$nativeElement.addEventListener(eventType, callback)
                        }
                    ` 
                `DomListener.js`:
                    `
                        initDomListeners() {
                            this.listeners.forEach(listener => {
                            // То же самое, что addEventListener
                                this.$root.on(listener, methodName)
                            })
                        }
                    `
                    `methodName` у нас пока нет. И, как я упоминал, он должен следовать принципу `input -> onInput`
            Для этого создадим файл `core/util.js`. В нём просто сделаем метод `capitalize`, пишущий имя с заглавной буквы.
                `util.js`:
                    `
                        // Purte functions
                        export function capitalize(string) {
                            if (typeof string !== "string" || !string) {
                                return "";
                            }
                            return string[0].toUpperCase() + string.slice(1);
                        }
                    `
                `DomListener.js` (в самом низу, вне класса):
                    `
                        // input -> onInput
                        function getMethodName(eventName) {
                            return `on${capitalize(eventName)}`
                        }
                    `
                `DomListener.js` (внутри класса):
                    `
                        initDomListeners() {
                            this.listeners.forEach(listener => {
                            const methodName = getMethodName(listener)
                            // То же самое, что addEventListener
                            this.$root.on(listener, this[methodName])
                            })
                        }
                    `
            Проверим, вызывается ли метод, если мы явно укажем его название (вместо `methodName` -> `onInput`)
                `DomListener.js`: `this.$root.on(listener, this['onInput'])`
                Видим в консоли объект события при каждом вводе с формулу сивмола
                Поменяем немного метод `onInput` в классе `Formula`, чтобы писался в кнсоль чистый текст, а не объект события
                    `Formula`:
                        `
                            onInput(event) {
                                console.log('Formula: onInput', event);
                            }
                        `
                Смотрим в консоль, всё ок. Видим чистый текст
            Вернём обратно на `methodName`

        * Но тут есть нюанс. Если мы в `Formula` в методе `onInput` выведем в консоль `this`, то увидим, что контекст переопределился, и сейчас `this` - это html-нода, которую мы переопределили в следующей строчке в методе `on` файла `util.js`:
            `this.$nativeElement.addEventListener(eventType, callback)`
        Как же быть? Исправляется такая проблема крайне просто. Так как контекст переопределился, когда мы вызвали внутри метода `initDomListeners` файла `DomListener` => `this[methodName]`, надо тут просто добавить `bind(this)` к методу, и он проигнорирует переопределение контекста
            `DomListener`:
                `
                    initDomListeners() {
                        this.listeners.forEach(listener => {
                        const methodName = getMethodName(listener)
                        this[methodName] = this[methodName].bind(this)
                        // То же самое, что addEventListener
                        this.$root.on(listener, this[methodName])
                        })
                    }
                `
        * Маленький штришок - в конструктор класса `ExcelComponent` добавлю сточку `this.name = options.name || ''`, так как внктри, допустим, формулы мы созлайм в `options` такое свойство `name` 

        * Теперь нужно реализовать удаление листенеров.
            Для этого я добавлю метод `off` в `dom.js`:
                `
                    off(eventType, callback) {
                        this.$nativeElement.removeEventListener(eventType, callback)
                    }
                `
            `DomListener`:
                `
                    removeDomListeners() {
                        this.listeners.forEach(listener => {
                            const methodName = getMethodName(listener)
                            this.$root.off(listener, this[methodName].bind(this))
                        })
                    }
                `
        * Теперь в `ExcelComponent` добавим метод `destroy()`, в котором удалим листенеры
            `
                destroy() {
                    this.removeDomListeners()
                }
            `

        * Сейчас мы реализовали практически весь функционал класса `ExcelComponent`. Давайте протестируем это. например, на примере `toolbar`. Дадим его конструктор, в котором определим листенер `click` и метод `onClick`
            `Toolbar.js`:
                `
                    constructor($root) {
                        super($root, {
                            name: "Toolbar",
                            listeners: ["click"],
                        });
                    }

                    onClick(event) {
                        console.log(event.target);
                    }
                `
        Сохраняем, теперь по клику на элементы туллбара мы видим в консоли элементы, по которым мы кликнули. Радуемся этому!
        
    5. 3. Создание таблицы.
        5. 3. 1. Заголовки.
            В файле `Table.js` мы возвращаем статический html. Это не круто, поэтому удалим его и создадим для него автогенерированную вёрстку.
                Создадим файл, в который вынесем логику, связанную с вёрсткой таблицы и назовёт его `table.template.js`. Внутри него:
                    `
                        export function createTable() {
                            return "<h1>Table</h1>";
                        }
                    `
                Теперь удалим статику импортируем эту функцию в `Table.js`:
                    `Table.js`:
                        `
                            toHTML() {
                                return createTable();
                            }
                        `
            * Теперь подумаем какие параметры нам понадобятся для создания таблицы. И, пожалуй, это количество рядов. Дадим этот параметр в функцию и по дефолту их пусть будет 15
                `Table.js` -> `export function createTable(rowsCount = 15) {`
            Посмотрим на вёрстку таблицы (файл `assets/excel.html`). Там есть коренной элемент с классом  `excel__table` и в нём дивы с классом `row` (т.е. ряды). Внутри каждого из них есть див с классом `row-info` и `row-data`. Но первый ряд отличается. Это шапка таблицы с названиями колонок - `A, B, C,...`. поэтому помимо формирования рядов, нам надо сформировать и названия колонок - `A, B, C,...`. Вручную мы их не будем вписывать.
                Подумаем, как это сделать (сформировать буквы `A, B, C,...`.). Для этого обратимся к консоли.
                    `'A'.charCodeAt()` -> 65            // это код буквы `A` в таблице Ascii
                    `String.fromCharCode(65)` -> 'A'    // получили букву по коду
                    `String.fromCharCode(66)` -> 'B'    // получили букву по коду
                    `'Z'.charCodeAt()` -> 90            // это код буквы `Z` в таблице Ascii    
                По этим кодам мы и будем создавать буквы алфавита.
                Создадим константу:
                    `table.template.js` (в самом верху):
                        `
                            const CODES = {
                                A: 65,
                                Z: 90,
                            };
                        `
                        * Зачем это делать, если можно будет просто писать 65, 90. Затеи что запись `CODES.A` более понятна что означает. Писать `65, 90, ...` нарушает конвенцию `magic number`, гласящую, что не должно быть непонятных цифр, а нужно пояснение. 
            Определим количесиво столбцов.
                `table.template.js`:
                    `
                        export function createTable(rowsCount = 15) {
                            const colsCount = CODES.Z - CODES.A + 1;
                            return "<h1>Table</h1>";
                        }
                    `
            Теперь создадим функцию создания ряда:
                `table.template.js`:
                    `
                        function createRow() {
                            return `
                                <div class="row">
                                    <div class="row-info"></div>
                                    <div class="row-data"></div>
                                </div>  
                            `
                            }
                    `
            В диве класса `row-data` у нас лежат колонки. Создадим функцию для создания колонки тоже:

                    `
                        function createCol() {
                            return `<div class="column">A</div>`
                        }
                    `
            Теперь ячейка. 
                `table.template.js`:
                    `
                        function createCell() {
                            return `
                                <div class="cell" contenteditable>B1</div>
                            `
                            }
                    `
            Теперь все функции, в приципе есть, и можно заняться генерацией рядов. Их мы будем заносить в массив `rows` и в конце функции `createTable` будем возвращать `rows.join('')`
                `table.template.js`:
                    `
                        export function createTable(rowsCount = 15) {
                            const colsCount = CODES.Z - CODES.A + 1;
                            const rows = []    
                            return rows.join('');
                        }
                    `
            Теперь надо положить в массив `rows` первый ряд, который с имеенами типа `A, B, C, ...`. А потом все ряды (их `rowsCount` штук). Пока без контента.
                `table.template.js`:
                    `
                        export function createTable(rowsCount = 15) {
                            const colsCount = CODES.Z - CODES.A + 1;
                            const rows = []
                            rows.push(createRow())
                            for (let i = 0; i < rowsCount; i++) {
                                rows.push(createRow())
                            }
                            return rows.join('');
                        }
                    `
            * Сейчас если мы посмотрим в браузере, мы увидим некоторые сгенерированные ряды. Контента пока нет, но дивы класса `row-info` есть.
            Но контент нужен. Поэтому функция `createRow` будет принимать параметр `content`, который будет выводить в диве класса `row-data`.
                `table.template.js`:
                    `
                        function createRow(content) {
                            return `
                                <div class="row">
                                    <div class="row-info"></div>
                                    <div class="row-data">${content}</div>
                                </div>  
                            `
                        }
                    `
            * Подумаем пока про первый ряд, который шапка таблицы (`A, B, C, ..., Z`). Его контент типа `<div class="column">A</div><div class="column">B</div><div class="column">C</div>...`. Надо только сгенерировать эти буквы (по коду Ascii). У нас есть количество столбцов, и от него мы можем отталкиваться.
            Надо создать массив букв `A, B, C, ..., Z`. Потом из каждой буквы сделать колонку (ячейку колонки). Потом склеить их всех методом `join('')` и дать, как контент в метод `createRow`.
            Методу `createCol(el)` дадим параметр `el` на вход (это юудут меняющиеся буквы (`A, B, C, ..., Z`))
                `table.template.js`:
                    `
                        function createCol(el) {
                            return `<div class="column">${el}</div>`;
                        }
                    `

                    В самом методе `createTable` создадим массив из `rowsCount` элементов, превратим их в буквы, потом в колонки, потом соединим:

                    `
                        export function createTable(rowsCount = 15) {
                            const colsCount = CODES.Z - CODES.A + 1;
                            const rows = [];
                            const cols = new Array(colsCount)
                                .fill("")
                                .map((_, index) => String.fromCharCode(CODES.A + index))
                                .map((el) => createCol(el))
                                .join("");
                            rows.push(createRow(cols));
                            for (let i = 0; i < rowsCount; i++) {
                                rows.push(createRow());
                            }
                            return rows.join("");
                        }
                    `
            * Вуаля! Смотрим в браузере, видим шапку со всеми буквами от A до Z.
            * Теперь порефакторим код:
                1. `.map((el) => createCol(el))` -> `.map(createCol)`
                2. `.map((_, index) => String.fromCharCode(CODES.A + index))`: Вынесем в отдельную функцию `toChar`:
                    `
                        function toChar(_, index) {
                            return String.fromCharCode(CODES.A + index);
                        }
                    `
                3. `createCol` переименуем в `toColumn`
            * Итоговый код `table.template.js`:
                `
                    const CODES = {
                        A: 65,
                        Z: 90,
                    };
                    function createCell() {
                        return `
                            <div class="cell" contenteditable>B1</div>
                        `;
                    }
                    function toColumn(el) {
                        return `
                            <div class="column">${el}</div>
                        `;
                    }
                    function createRow(content) {
                        return `
                            <div class="row">
                            <div class="row-info"></div>
                            <div class="row-data">${content}</div>
                            </div>  
                        `;
                    }
                    function toChar(_, index) {
                        return String.fromCharCode(CODES.A + index);
                    }
                    export function createTable(rowsCount = 15) {
                        const colsCount = CODES.Z - CODES.A + 1;
                        const rows = [];
                        const cols = new Array(colsCount)
                            .fill("")
                            .map(toChar)
                            .map(toColumn)
                            .join("");
                        rows.push(createRow(cols));
                        for (let i = 0; i < rowsCount; i++) {
                            rows.push(createRow());
                        }
                        return rows.join("");
                    }
                `
        5. 3. 2. Ячейки.
        *** Сделать ячейки постараться сделать домашним заданием (по аналогии с заголовками) ***
            Итак, нужно создать количество рядов, равное `rowsCount`. Каэжый ряд - это `colsCount` ячеек, каждая представляющая собой то, что возвращает метод `createCell` (переименуем его в `toCell` и удалим конетнт `B2`). Т.е. по аналогии с заголовками создадим массив длинной `rowsCount` (`new Array(colsCount)`), для каждого вызовем метод `toCell` и заджойнить:
                `table.template.js`:
                    `
                        function toCell() {
                            return `
                                <div class="cell" contenteditable></div>
                            `;
                        }
                    `
                    `
                        export function createTable(rowsCount = 15) {
                            const colsCount = CODES.Z - CODES.A + 1;
                            const rows = [];
                            const cols = new Array(colsCount)
                                .fill("")
                                .map(toChar)
                                .map(toColumn)
                                .join("");
                            rows.push(createRow(cols));
                            for (let i = 0; i < rowsCount; i++) {       <===========
                                const cells = new Array(colsCount)      <===========
                                .fill('')                               <===========
                                .map(toCell)                            <===========
                                .join('')                               <===========
                                rows.push(createRow(cells));     <===========
                            }
                            return rows.join("");
                        }
                    `
            Смотрим в браузере. Ячейки добавились, но нет цифр у дивов с классом `row-info`. Для этого добавим первым параметром индекс ряда в метод `createRow`. Первому ряду (шапке) индекс не нужен. Поэтому туда первым параметром дадим пустую строку. А где создаём ряды с рабочими ячейками, дадим `index + 1`, т.к. индексы в цикле `for` начинаются с нуля.
                `table.template.js` ():
                    `
                        const CODES = {
                            A: 65,
                            Z: 90,
                        };
                        function toCell() {
                            return `
                                <div class="cell" contenteditable></div>
                            `;
                        }
                        function toColumn(el) {
                            return `
                                <div class="column">${el}</div>
                            `;
                        }
                        function createRow(index, content) {
                            return `
                                <div class="row">
                                <div class="row-info">${index}</div>
                                <div class="row-data">${content}</div>
                                </div>  
                            `;
                        }
                        function toChar(_, index) {
                            return String.fromCharCode(CODES.A + index);
                        }
                        export function createTable(rowsCount = 15) {
                            const colsCount = CODES.Z - CODES.A + 1;
                            const rows = [];
                            const cols = new Array(colsCount)
                                .fill("")
                                .map(toChar)
                                .map(toColumn)
                                .join("");
                            rows.push(createRow('', cols));
                            for (let i = 0; i < rowsCount; i++) {
                                const cells = new Array(colsCount)
                                .fill('')
                                .map(toCell)
                                .join('')

                                rows.push(createRow(i + 1, cells));
                            }
                            return rows.join("");
                        }
                    `
            * Смотрим в браузере. Радуемся тому, как всё круто. Теперь мы можем изменить `createTable(rowsCount = 100)` (было 25). И у нас станет 100 рядов. Какие мы красавы!
        * Сейчас мы закончили приготовление фреймворка и теперь добавим все изменнеия в гит.
            `git add .`
            `git commit -m 'Finish base framework functional'`
            `git push -u origin framework-start`
        Всё, запушили. Заходим на сайт `github`. Видим в ветке `main` старый код. 
        Заходим в ветку `framework-start`. Видим новый код. Надо сделать `pull-request` и замёржить ветки.
        Видим, что ветка `framework-start` отличается от ветки `main` на 1 коммит. Это тот самый коммит, который мы сделали в ветке `framework-start`.
        Кликаем по кнопке `Compare and pull request`
            `Create pull request`
            `Merge pull request`
            `Confirm merge`
        Всё, замёржили ветки. Теперь в ветке `main` тоже есть новый код.
        Теперь надо сделать `git pull` в ветке `main`:
            `git checkout main`
            `git pull`




    *** Начать с урока 03_12 00:00 ***
