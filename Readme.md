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
s3. 1. Установка плагинов
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

3. 2. Установка лоадеров 
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

3. 3. Добавление режимов сборки:
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
3. 5. Git flow.
    `git add .`
    `git commit -m 'Finish project config'`
    `git push -u origin webpack` (Или просто `git push`. Проверить, проканает ли, если нет, то полную комманду с `-u origin`)

    Идём на сайт гитхаба:
        Мы там в ветке `main`, код старый. Переключаемся на ветку `webpack`, видим изменённый код.
        * Хотим смёржить ветки, кликаем на "Compare & pull request". Там стрелочкой показано, что мы заливаем ветку `webpack` в `main`.
        Оставляем комментарий 'Added webpack and 2 modes for development and production'
        * Там справа "Reviewers", показать, что есть такие, их можно добавлять но в этом проекте никого.
        Переходим на сам проект, там во вкладке `Pull-requests` теперь `1`. Заходим туда. Там видны коммиты, что было изменено. Заходим на большой коммит `Finish...` Делаем поиск по `semi` Осталяем комментарий у `"semi": "off"`: "Почему нет точек с запятой?".
        Возвращаемся на наш pull-requst. Обращаем внимание на кнопку `Merge pull request`:
        * `Squash and merge` означает скомбинировать все коммиты в один. Rebase - rebase :)
        Нажимаем `Merge pull request`, `Confirm merge`
        Всё, тепеь ветки смёрджины. Переходим на ветку `main`, радуемся обновлённому коду.
        Переходим на ветку `main`:
            `git checkout main`
            `git pull`
        Круто, теперь мы соединили ветки, закончили с настройкой `webpack` и можем идти дальше.
        * Теперь мы от ветки main будем создавать другие ветки и работать в них. Ветку `webpack` на этом моменте удаляют, так как она больше не нужна. Но мы не будем.

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



    
