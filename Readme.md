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

    Видим в консоли консоль логи, это значит, что `production`-сборка работает

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
        Видим `bundle.js` - главный скрипт. С хэшем. Внутри html с подключённым скриптом
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
    Например, `hash` мы хотим добавлять только в режиме `production`
    Для этого пишем функцию `filename`:
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
    * Можно всё настраивать самому, но лучше воспользоваться готовым пресетом. например, `google-eslint`. Это пакет, содержащий в себе базовую конфигурацию, который google считает нужным для JS `style-guide`
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
    
4. 1. Планирование (диаграмма `Layout`) (в гугле `drawio`, чтоб попасть на сайт):
    Сайт будет содержать 2 страницы
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
    Начнём со страницы `Excel` (1):
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
     Кнопки справа будут такие же, как и  в туллбаре, только разнах цветов. Поэтому сделаем для этого миксин:
         `_mixins.scss`:
             `
                  @mixin button($color: green) {
                      height: 24px;
                      min-width: 24px;
                      padding: 3px;
                      text-align: center;
                      position: relative;
                      display: inline-block;
                      color: rgba(0, 0, 0, 0.7);
                      & span {
                           font-size: 18px;
                      }
                      &:active, &.active {
                          color: $color;
                      }
                      &:hover {
                          background-color: #eee;
                          cursor: pointer;
                      }
                  }
             `

       Применяем миксин:
       `_header.scss`:
       `
           & .button {
               @include button(red);
           }
       `
     Смотрим в браузере, радуемся, что всё ок. Дальше - Toolbar.

4. 4. Вёрстка Toolbar:
     Ищем иконки: Сайт `fonts.google.com` (или в поиске `material icons`) => Material icons, filled => Поиск по категориям => `Text formatting` => Берём иконки: `format_align_left`, `format_align_center`, `format_align_right`, `format_bold`, `format_italic`, `format_underlined`. Вставляем в html => в класс `excel__toolbar`
    * `index.html`:
        `
            <div class="excel__toolbar">
                <div class="button">
                    <span class="material-icons">
                        format_align_left
                    </span>
                </div>
                <div class="button">
                    <span class="material-icons">
                        format_align_center
                    </span>
                </div>
                <div class="button">
                    <span class="material-icons">
                        format_align_right
                    </span>
                </div>
                <div class="button">
                    <span class="material-icons">
                        format_bold
                    </span>
                </div>
                <div class="button">
                    <span class="material-icons">
                        format_italic
                    </span>
                </div>
                <div class="button">
                    <span class="material-icons">
                        format_underlined
                    </span>
                </div>
            </div>
        `
   
    * `__variables.scss`:
         `$toolbar-height: 40px;`
     `toolbar.scss`:
        * `
            .excel__toolbar {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                height: $toolbar-height;
                border-top: 1px solid #c0c0c0;
                border-bottom: 1px solid #c0c0c0;
                padding: 7px 10px;
                display: flex;
                & .button {
                    @include button();
                }
                // temp
                background-color: aqua;
            }
        `
          * Если мы так и оставим `top: 0`, то туллбар будет на том же месте, что и header. Поэтому дадим `top: $header-height;`
          Удаляем `temp background-color`
4. 5. Стили для Formula
    `index.html` => class=`excel__formula`: 
        `
            <div class="info">fx</div>
            <div class="input" contenteditable></div>
        `
        * `contenteditable` у дива делаем его инпутом, но без инпутовских стилей. Т.е. то, что нам нужно. 
        Сейчас, если начнём вводить некорректные слова, они будут подчеркнуты красным. Это `spellcheck`. Чтобы его отключить, добавим к `contenteditable spellcheck="false"`
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
    Удалим класс `selected` у дива с контентом `A2`
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
    Name и Date of opening разошлись по разным местам, всё ок.
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
    Все 4 компонента страницы будут наследоваться от класса `ExcelComponent`, который будет наследоваться от класса `DomListener`
    Эти 4 компонента будут входить в общего родителя-класс `Excel`
   
    `index.html`: удалим console.log

    * Теперь наконец приступим к логике, js. Для начала создадим базовую структуру классов
    * В `webpack.config` мы создавали alias `@core` -> `src/core`. Поэтому создадим папку `src/core`. В ней будем хранить основные вещи. Классы мы будем создавать с большой буквы, остальные вещи - с маленькой.

    * Создадим файл `src/core/DomListener.js`. В нём:
        `
            export class DomListener { 
            }
        `
    EsLint ругается на `no-trailing-spaces`. Поэтому добавлю в `.eslintrc` => `"no-trailing-spaces": "off",`
    * Теперь создадим файл `src/core/ExcelComponent.js`, который будет наследоваться от класса `DomListener`:
    * `src/core/ExcelComponent.js`:
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
    * Теперь мы хотим в методе `render` добавлять элементу `$el` наши компоненты. Сначала положим туда тестовый элемент, чтобы проверить, добавится ли он:
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
          `Excel.js`:
            `
            getRoot() {
                const $root = document.createElement('div')
                $root.classList.add('excel')
                this.components.forEach(Component => {
                const $el = document.createElement('div')
                const className = Component.className
                $el.classList.add(className)
                const component = new Component()
                $el.innerHTML = component.toHTML()
                $root.append($el)
                })
                return $root
            } 
            `

    * Поговорим о классе `DomListener`. Это класс, который будет отвечать за добавление листенеров. И, конечно, ему надо знать на какой элемент ему надо эти листенеры навесить. Поэтому ему в конструктор мы дадим `$root`-элемент, на который и будем вешать прослушку событий. И, если его не будет, будем кидать ошибку.
        * `core/DomListener.js`: 
            `
                export class DomListener {
                    constructor($root) {
                        if (!$root) {
                            throw new Error('No root element provided for DomListener!')
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
                            const component = new Component($el)   // new $el
                            $el.innerHTML = component.toHTML()
                            $root.append($el)
                        })
                        return $root
                    }
                `
            * Переделали мы немного тут структуру. Теперь мы создаём внутренний элемент `$el`, в который складываем `component.toHTML()`, и его добавляем, как элемент в главный `$root`
        * Смотрим в браузере структуру HTML. Радуемся правильным названиям классов у главного дива `excel` и главных классов каждого из компонентов.
        * Теперь перенесём вёрстку в компоненты. 
        * Покажу на примере `Header`: 
            В файл `Header.js` копипастим внутренности `<div class="excel__header">`.
        Аналогично с `Toolbar, Formula, Table`.
        * Смотрим в браузере, радуемся правильной вёрстке

        * Теперь порефакторим код. В классе `Excel.js` мы работаем с такими методами, как `document.createElement`, `classList.add`. Вынесем их в отдельный `helper`-класс.
            Создадим файл `core/Dom.js`. Это будет утилита, позволяющая проще взаимодействовать с dom-деревом. Аля свой jquery.
            * `dom.js`:
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
                * `Excel.js`:
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
            Теперь сделаем так, чтобы в конструктор `$` мы давали либо селектор, либо `dom`-ноду. Если селектор, то будем вызывать `document.querySelector`, если ноду - то её сразу записывать в переменную `nativeElement` (*** в курсе эта переменная называется `$el`, но я переименовал, потому что возникает путаница с переменной `$el` из класса `Excel` ***):
                * `dom.js`:
                  `
                    export class Dom {    
                        constructor(selectorOrNode) {
                            this.nativeElement = typeof selectorOrNode === 'string'
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

            Теперь сделаем метод `html`, который будет аналогичен методы `html` в `jquery`. Его суть: если мы передаём какой-то параметр в этот метод, то мы переписываем `innerHTML` элемента `nativeElement`. Если ничего не передаём, то просто вернуть его `outerHTML`:
                * `dom.js` -> внутри класса `Dom`:
                    `
                        html(html) {
                            if (typeof html === 'string') {
                                this.nativeElement.innerHTML = html
                                return this
                            }
                            return this.nativeElement.outerHTML.trim()
                        }
                        clear() {
                            this.html('')
                            return this
                        }
                    `
                        * Строка `return this` для того, чтобы мы могли чейнить. Т.е. писать код типа `$('div').html('<h1>test</h1>').clear()`. Это, кстати, популярный паттерн в js.
                    Теперь `Excel.js`:
                        `$el.html(component.toHTML())` вместо `$el.innerHTML = component.toHTML()`
            Смотрим в браузере, видим ошибку `$root.append is not a function`. Это потому что `$root` теперь у нас - это элемент класса `Dom`, а не дом-нода. Тогда надо создать такой метод в классе `Dom`:
            * `dom.js` -> внутри класса `Dom`:
                `
                    append(nodeOrDomObject) {
                        let node = nodeOrDomObject
                        if (nodeOrDomObject instanceof Dom) {
                            node = nodeOrDomObject.nativeElement
                        }
                        this.nativeElement.appendChild(node)
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
            * `Formula.js`:
                `
                    constructor($root) {
                        super($root, {
                            name: 'Formula',
                            listeners: ['input', 'click'],
                        })
                    }
                `
                * `Name` - это просто имя класса, чтобы легче было отследить, где ошибка и прочее. И массив `listeners`. В нём будут перечислены все листенеры компонента. И конвенция наша такая, что если есть листенер, допустим `input`, значит, должен быть реализован метод `onInput`, в который мы передаём `event` и можем реагировать на это событие.
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
                * `ExcelComponent`:
                    `
                        init() {
                            this.initDomListeners()
                        }
                    `
        * Сейчас сделаем так, чтобы в классе `Excel` поле `components` было действительно экземплярами классов `Header`, `Formula`, ...
        Пока это просто функции. Выведем в консоль, что такое `this.components`:
            * `Excel.js`:
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
                        console.log('this.components', this.components);   // Видим, что это объекты
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
        * Допустим, у нас есть какой-то компонент (например, формула). У неё должен быть какой-то листенер (например, 'input'). Formula наследуется от класса `ExcelComponent`. Но он нас сейчас не интересует, и его мы пропустим. А нарисуем сразу класс `DomListener`. Этот класс должен определить, что при срабатывании такого листенера (input), нужно определить метод `onInput` и вызывать его внутри самого класса Formula.
        Вспомним, что у каждого компонента есть элемент `$root`, и это главный `Dom`-элемент компонента.
        Т.е. в классе `DomListener` есть доступ до элемента `$root`. И в этом классе мы будем вешать на листенеры вызов метода (например, на листенер `input` вызов метода `onInput`, который должен быть объявлен внутри класса компонента).
        Теперь сделаем это.
            Сначала добавим в файл `dom.js` метод `on(eventType, callback)`, в котором сделаем `addEventListener`
                * `dom.js`
                    `
                        on(eventType, callback) {
                            this.nativeElement.addEventListener(eventType, callback)
                        }
                    ` 
                * `DomListener.js`:
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
                        // Pure functions
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
                Поменяем немного метод `onInput` в классе `Formula`, чтобы писался в консоль чистый текст, а не объект события
                    `Formula`:
                        `
                            onInput(event) {
                                console.log('Formula: onInput', event.target.textContent.trim());
                            }
                        `
                Смотрим в консоль, всё ок. Видим чистый текст
            Вернём обратно на `methodName`

        * Но тут есть нюанс. Если мы в `Formula` в методе `onInput` выведем в консоль `this`, то увидим, что контекст переопределился, и сейчас `this` - это html-нода, которую мы переопределили в следующей строчке в методе `on` файла `dom.js`:
            `this.nativeElement.addEventListener(eventType, callback)`
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
        * Маленький штришок - в конструктор класса `ExcelComponent` добавлю сточку `this.name = options.name || ''`, так как внутри, допустим, формулы мы создаём в `options` такое свойство `name` 

        * Теперь нужно реализовать удаление листенеров.
            Для этого я добавлю метод `off` в `dom.js`:
                `
                    off(eventType, callback) {
                        this.nativeElement.removeEventListener(eventType, callback)
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
                Создадим файл, в который вынесем логику, связанную с вёрсткой таблицы и назовём его `table.template.js`. Внутри него:
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
                        * Зачем это делать, если можно будет просто писать 65, 90. Затем, что запись `CODES.A` более понятна что означает. Писать `65, 90, ...` нарушает конвенцию `magic number`, гласящую, что не должно быть непонятных цифр, а нужно пояснение. 
            Определим количество столбцов.
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
            Теперь все функции, в приципе, есть, и можно заняться генерацией рядов. Их мы будем заносить в массив `rows` и в конце функции `createTable` будем возвращать `rows.join('')`
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
            Методу `createCol(el)` дадим параметр `el` на вход (это будут меняющиеся буквы (`A, B, C, ..., Z`))
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
                Тогда `.map((_, index) => String.fromCharCode(CODES.A + index))` -> `.map(toChar)`
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
            Итак, нужно создать количество рядов, равное `rowsCount`. Каждый ряд - это `colsCount` ячеек, каждая представляющая собой то, что возвращает метод `createCell` (переименуем его в `toCell` и удалим контент `B2`). Т.е. по аналогии с заголовками создадим массив длинной `colsCount` (`new Array(colsCount)`), для каждого вызовем метод `toCell` и заджойнить:
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
                                rows.push(createRow(cells));            <===========
                            }
                            return rows.join("");
                        }
                    `
            Смотрим в браузере. Ячейки добавились, но нет цифр у дивов с классом `row-info`. Для этого добавим первым параметром индекс ряда в метод `createRow`. Первому ряду (шапке) индекс не нужен. Поэтому туда первым параметром дадим пустую строку. А где создаём ряды с рабочими ячейками, дадим `index + 1`, т.к. индексы в цикле `for` начинаются с нуля.
                `table.template.js` (весь):
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
                        function createRow(index, content) {                                    <=========== edited
                            return `
                                <div class="row">
                                <div class="row-info">${index}</div>                             <=========== edited
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
                            rows.push(createRow('', cols));                                      <=========== edited
                            for (let i = 0; i < rowsCount; i++) {
                                const cells = new Array(colsCount)
                                .fill('')
                                .map(toCell)
                                .join('')
                                rows.push(createRow(i + 1, cells));                              <=========== edited
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
        Теперь в ветке `main` локальной тоже есть новый код. Радуемся этому.
   6. Ресайз таблицы.
       6. 1. Алгоритм действий.
           Сразу перейдём на новую ветку `resize`
               `git checkout -b resize`
           И запустим проект
               `npm run start`
           * Показать, как происходит ресайз ячеек в реальном Excel. Навожу на грань колонки, появляется какой-то значок, двигаю мышкой - меняется ширина колонки. Также и с рядами.
           * Подумаем, как это реализовать. Для этого сделаем диаграмму `Ресайз`.
           * Для начала сделаем ресайз колонок. Для этого надо сделать следующее:
               1. При наведении на границу колонки должен появляться значок ресайза
               2. При клике на границу колонки должна появляться горизонтальная полоса ресайза
               4. При движении мышки вправо-влево должна меняться ширина колонки
               5. При отпускании мышки должен применяться ресайз

           Теперь откроем файл `Table.js`. Создадим конструктор и добавим пару листенеров: `click` и `mousedown`
               `Table.js`:
                   `
                       constructor($root) {
                           super($root, {
                               listeners: ["click", "mousedown"],
                           });
                       }
                       onClick() {
                           console.log("click");
                       }
                       onMousedown(event) {
                           console.log("mousedown", event.target);
                       }
                   `
               * Сейчас мы видим в консоли, что при нажатии на таблицу, срабатывает листенер `mousedown`. А когда отрываем курсор, срабатывает `click`. Т.е. когда мы зажали мышку и двигаем её, срабатывает `mousedown`. А когда отпускаем, срабатывает `click`. 
               * А при движении мышки срабатывает листенер `mousemove`. Поэтому добавим его тоже:
                   `Table.js`
                       `
                           constructor($root) {
                               super($root, {
                                   listeners: ["click", "mousedown", "mousemove"],
                               });
                           }
                           onClick() {
                               console.log("click");
                           }
                           onMousedown(event) {
                               console.log("mousedown", event.target);
                           }
                           onMousemove() {
                               console.log("mousemove");
                           }
                       `
               * Т.е. порядок действий такой - мы зажимаем мышку, срабатывает `mousedown`. Двигаем мышку, срабатывает `mousemove`. Отпускаем мышку, срабатывает `mouseup`.
       6. 2. Создаём элемент для ресайза.
           Сотрём все листенеры, они нам пока не нужны.
               `Table.js` (full)
                   `
                       export class Table extends ExcelComponent {
                           static className = "excel__table";
                           constructor($root) {
                               super($root, {
                               // listeners: ["click", "mousedown", "mousemove"],
                               });
                           }
                           toHTML() {
                               return createTable(20);
                           }
                       }
                   `
           * В каждой колонке хэдера создадим див с классом `col-resize`. Это и будет наш элемент ресайза:
               `table.template.js`:
                   `
                       function toColumn(el) {
                           return `
                               <div class="column">
                                   ${el}
                                   <div class="col-resize"></div>
                               </div>
                           `;
                       }
                   `
            
               * Теперь в каждой ячейке хэдера есть див с классом `col-resize`. Это и есть элемент для ресайза. Поэтому надо сделать так, чтобы при наведении на ячейку, был виден этот элемент.
                   `table.scss`:
                       `
                           .col-resize {
                               position: absolute;
                               top: 0;
                               right: 0;
                               bottom: 0;
                               width: 4px;
                               background-color: #3c74ff;
                               cursor: col-resize;
                           }
                       `
                   Цвет этот мы будем ещё использовать, поэтому вынесем его в переменную:
                       `table.scss`:
                           `
                               .column {
                                   position: relative;
                                   display: flex;
                                   ...
                               .col-resize {
                                   position: absolute;
                                   top: 0;
                                   right: 0;
                                   bottom: 0;
                                   width: 4px;
                                   background-color: $primary-color;
                                   cursor: col-resize;
                               }
                           `
                       `_variables.scss`:
                           `
                               $primary-color: #3c74ff;
                           `
               * Эти элементы синенькие должны быть видны только тогда, когда мы наводим на них курсор. Поэтому по умолчанию будет `opacity: 0`, а при наведении мыши - `opacity: 1`
                   `table.scss`:
                       `
                           .col-resize {
                               position: absolute;
                               top: 0;
                               right: 0;
                               bottom: 0;
                               width: 4px;
                               background-color: $primary-color;
                               cursor: col-resize;
                               opacity: 0;
                               transition: opacity 0.1s ease-in-out;
                                   &:hover {
                                       opacity: 1;
                                   }
                           }
                       `
                   * Теперь со строчками.
                       Внутри дива с классом `row-info` нужно поместить такой же див.
                           `table.template.js`:
                               `
                                   function createRow(index, content) {
                                       return `
                                           <div class="row">
                                           <div class="row-info">
                                               ${index}
                                               <div class="row-resize"></div>
                                           </div>
                                           <div class="row-data">${content}</div>
                                           </div>  
                                       `;
                                   }
                               `

                               `table.scss`:
                                   `
                                   .row-info {
                                       position: relative;
                                       display: flex;
                                       ...
                                       .row-resize {
                                           position: absolute;
                                           left: 0;
                                           right: 0;
                                           bottom: 0;
                                           height: 4px;
                                           background-color: $primary-color;
                                           cursor: row-resize;
                                           opacity: 0;
                                           transition: opacity 0.1s ease-in-out;
                                           &:hover {
                                               opacity: 1;
                                           }
                                       }
                                   `
                   Теперь у нас есть дублирование кода, это надо исправить
                       `table.scss`:
                           `
                               .col-resize,
                               .row-resize {
                                   position: absolute;
                                   right: 0;
                                   bottom: 0;
                                   background-color: $primary-color;
                                   opacity: 0;
                                   transition: opacity 0.1s ease-in-out;

                                   &:hover {
                                       opacity: 1;
                                   }
                               }

                               .col-resize {
                                   top: 0;
                                   width: 4px;
                                   cursor: col-resize;
                               }

                               .row-resize {
                                   left: 0;
                                   height: 4px;
                                   cursor: row-resize;
                               }
                           `
                   Проверяем в браузере. Всё ок.
                   Теперь уберём `opacity: 0`. Убрали. Видим, что у ячеек рядов сверху один лишний ресайзер.
                   Поэтому в функции `createRow` добавим условие, что если `index` пустой, то не выводить ресайзер:
                       `table.template.ts`:
                           `
                               function createRow(index, content) {
                                   const resize = index ? '<div class="row-resize"></div>' : ""
                                   return `
                                       <div class="row">
                                       <div class="row-info">
                                           ${index}
                                           ${resize}
                                       </div>
                                       <div class="row-data">${content}</div>
                                       </div>  
                                   `;
                               }
                           `
                   * Вернём `opacity`

           * Теперь поработем над логикой элемента ресайза. Событие, на которое мы будем реагировать в первую очередь - `mousedown`. Поэтому в компоненте таблицы (`Table`) надо создать листенер `mousedown` и, соответственно, коллбэк `onMousedown(event)`:
               `Table.js` (full):
                   `
                       export class Table extends ExcelComponent {
                           static className = "excel__table";
                           constructor($root) {
                               super($root, {
                                   listeners: ["mousedown"],
                               });
                           }
                           toHTML() {
                               return createTable(20);
                           }
                           onMousedown(event) {
                               console.log(event.target);
                           }
                       }
                   `
                   * Смотрим в консоли, видим элементы, по которым мы кликаем.
                   * Коллбэк срабатывает по клику на любой элемент. А нужно нам, чтобы он срабатывал только по клику на ресайзер. Подумаем, как это сделать (выделить элементы ресайза и реагировать только на клики по ним).

           *** Тут надо объяснить почему мы будем работать с дата-атрибутами, а не с классами, id или ещё что-то такое, связанное с View. Нам надо определять по какому элементу мы кликаем. Можно, конечно, это определять по классу, но тогда может произойти следующее. Моэет прийти тимлид и сказать, что названия классов не соответствуют нашему стайл-гайду, и надо бы их переименовать. Мол, БЭМ неправильный, например. Или вообще прийдёт следующий программист, которому не понравятся эти названия классов, и он их изменит. Тогда логика полетит к чертям. Это допускать никак нельзя. Классы, id - только для вью. Для всех логических вещей мы будем использовать data-атрибуты. Они будут служить нам метадатой. Прослойкой, какбэ, между вью и логикой. *** `(Ресайз, диаграмма 2)`

           * Поэтому добавим элементам ресайза атрибут `data-resize` в значении `row` и `col`:
               `table.template.js`:
                   `
                       function toColumn(el) {
                           return `
                               <div class="column">
                               ${el}
                               <div class="col-resize" data-resize="col"></div>                                 <======= Edited
                               </div>
                           `;
                           }

                           function createRow(index, content) {
                           const resize = index ? '<div class="row-resize" data-resize="row"></div>' : ""       <======= Edited
                           return `
                               <div class="row">
                               <div class="row-info">
                                   ${index}
                                   ${resize}
                               </div>
                               <div class="row-data">${content}</div>
                               </div>  
                           `;
                           }
                   `
           * Теперь надо отловить клик по именно элементу ресайза (взять значение их дата-атрибута).
           Значение любого атрибута можно взять через `.getAttribute(attrName)`
               `Table.js`:
                   `
                       onMousedown(event) {
                           console.log(event.target.getAttribute("data-resize"));
                       }
                   `
           Но можно и проще. В `event.target` есть свойство `dataset`, в котором лежат все дата-атрибуты. Поэтому можно сразу обратиться к нему:
               `Table.js`:
                   `
                       onMousedown(event) {
                           console.log(event.target.dataset.resize);
                       }
                   `
                   * Смотрим в консоли. Видим, что при клике на ресайзеры, выводится `col` и `row`. Это и есть наши дата-атрибуты.
                   * Сделаем проверку на элемент ресайза:
                       `Table.js`:
                           `
                               onMousedown(event) {
                                   if (event.target.dataset.resize) {
                                       console.log('Start resizing: ', event.target.dataset.resize);
                                   }
                               }
                           `

       6. 3. Изменяем размер колонок.
           *** Теперь сделаем, наконец, сам ресайз колонок ***
               Когда мы нажали на ресайзер, надо сделать следующее:
                   1. Найти элемент, который мы будем ресайзить
                   2. Посчитать его новую ширину
                   3. Изменить ширину элемента
               * Теперь надо найти элемент, который мы будем ресайзить. Это будет ячейка, в которой находится ресайзер. Мы можем найти его как `parentNode` элемента ресайза.
                   `Table.js`:
                       `
                           onMousedown(event) {
                               if (event.target.dataset.resize) {
                                   const $resizer = $(event.target);
                                   const $parent = $resizer.nativeElement.parentNode;
                                   console.log($parent);
                               }
                           }
                       `
                       * Смотрим в консоли, работает, но это не очень, потому что `parentNode` лучше не использовать, так как, если мы изменим вёрстку, и элемент уже не будет родительским к ресайзу, логика полетит.
                       Можно использовать `const $parent = $resizer.nativeElement.closest(".column")`, но это опять привязка к вью, поэтому мы не будем так делать.
               
               Поэтому мы опять будем использовать дата-атрибуты, и нужному диву дадим `data-type='resizable'`
                        
                       `table.template.js`:
                           `
                               function toColumn(el) {
                                   return `
                                       <div class="column" data-type="resizable">                  <====== Edited
                                       ${el}
                                       <div class="col-resize" data-resize="col"></div> 
                                       </div>
                                   `;
                               }
                           `    
               Проверяем в консоли, всё ок.
                           * Перенесём только в класс `Dom` метод, получающий ближайшего родителя
                               `Dom.js`:
                                   `
                                       export class Dom {
                                           ...
                                           closest(selector) {
                                               return $(this.nativeElement.closest(selector));
                                           }
                                       }
                                   `
                           * Теперь в `Table.js` мы можем написать так:
                               `Table.js`:
                                   `
                                       onMousedown(event) {
                                           if (event.target.dataset.resize) {
                                               const $resizer = $(event.target);
                                               const $parent = $resizer.closest("[data-type='resizable']");
                                               console.log($parent);
                                           }
                                       }
                                   `
                                   Проверяем в консоли (кликаем на `resizer` колонки), всё ок (там `Dom`-объект с нужным `nativeElement`).
                           * Теперь надо написать метод, возвращающий размеры элемента. Для этого в html есть функция `getBoundingClientRect()`
                               `Dom.js`:
                                   `
                                       export class Dom {
                                           ...
                                           getCoords() {
                                               return this.nativeElement.getBoundingClientRect();
                                           }
                                       }
                                   `
                           * У `getBoundingClientRect()` есть свойства `width`,  `height`, `right`. Поэтому в `Table.js` мы можем написать так:
                               `Table.js`:
                                   `
                                       onMousedown(event) {
                                           if (event.target.dataset.resize) {
                                               const $resizer = $(event.target);
                                               const $parent = $resizer.closest("[data-type='resizable']");
                                               console.log($parent.getCoords());
                                           }
                                       }
                                   `
                                   Проверяем в консоли, видим объект со свойствами `width`,  `height`, `right`. `width` - это ширина колонки, которую мы будем ресайзить. `right` - это правая граница колонки, которую мы будем ресайзить. `height` - высота колонки, которую мы будем ресайзить. 
               * Теперь надо отслеживать изменение курсора при перемещении. Поэтому в классе `Table` изменим коллбэк `onMousedown`, вставив туда листенер `mousemove`.
                   `Table.js`:
                       `
                           onMousedown(event) {
                               if (event.target.dataset.resize) {
                                   const $resizer = $(event.target);
                                   const $parent = $resizer.closest("[data-type='resizable']");
                                   const coords = $parent.getCoords();
                                   document.onmousemove = e => {
                                       const delta = e.x - coords.right;
                                       console.log(delta);
                                   };
                               }
                           }
                       `
                       Кликаем, двигаем мышку, видим в консоли разницу в пикселях. Это и есть то, на сколько мы сдвинули курсор. Но нам нужно не это, а новая ширина колонки. Поэтому надо сосчитать её новую ширину и изменить её стиль `width`:
                           `Table.js` => `onMousedown`:
                               `
                                   document.onmousemove = e => {
                                       const delta = e.x - coords.right;
                                       const value = coords.width + delta;
                                       $parent.nativeElement.style.width = value + "px";
                                   };
                               `
                       Меняем в браузере её ширину, всё ок.
                       Но когда мы отпускаем мышку, она всё ещё ресайзится. Поэтому надо добавить листенер `mouseup`:
                           `Table.js` => `onMousedown`:
                               `
                                   document.onmouseup = () => {
                                       document.onmousemove = null;
                                   };
                               `
                       Теперь всё ок.
           * Теперь надо сделать так, чтобы менялась ширина у всех ячеек в колонке. Для этого надо им всем дать дата-атрибуты как у колонки. Назову их `data-col`. Для этого в метод `toColumn` передам ещё индекс, который и есть номер колонки.
               `table.template.js`:
                   `
                       function toColumn(el, index) {
                           return `
                               <div class="column" data-type="resizable" data-col="${index}">
                               ${el}
                               <div class="col-resize" data-resize="col"></div> 
                               </div>
                           `;
                       }
                   `
               Теперь в каждой верхней ячейке есть дата-атрибут `data-col`, который равен номеру колонки. проверяем это в devTools.
               Теперь нужно такие же индексы задать для каждой из ячеек.
               Это метод `toCell`. Передадим ему индекс колонки и индекс ряда.
                   `table.template.js`:
                       `
                           function toCell(_, col) {
                               return `
                                   <div class="cell" contenteditable data-col="${col}"></div>
                               `;
                           }
                       `
               Теперь в каждой ячейке есть дата-атрибут `data-col`, который равен номеру колонки. проверяем это в devTools.
               * Давайте теперь сделать в классе `Dom` геттер на `dataset`.
                   `Dom.js`:
                       `
                           export class Dom {
                               ...
                               get data() {
                                   return this.nativeElement.dataset;
                               }
                           }
                       `
               Глянем в консоли:
                   `Table.js`:
                       `
                           onMousedown(event) {
                               if (event.target.dataset.resize) {
                                   const $resizer = $(event.target);
                                   const $parent = $resizer.closest("[data-type='resizable']");
                                   const coords = $parent.getCoords();
                                   console.log($parent.data);                                          <=========== new
                                   ...
                       `
                           Кликаем на `resizer`, видим в консоли `dataset` типа `{type: 'resizable', col: '6'}`
               * Теперь надо сделать так, чтобы при ресайзе менялась ширина всех ячеек в колонке. Для этого надо найти все ячейки в колонке. Для этого в классе `Table` надо обратиться к `Dom`-дереву и поменять у всех ячеек `style.width`
                   `Table` => `onMousedown`:
                       `
                           ...
                           document.onmousemove = (e) => {
                               const delta = e.x - coords.right;
                               const value = coords.width + delta;
                               $parent.nativeElement.style.width = value + "px";
                               document
                                   .querySelectorAll(`[data-col="${$parent.data.col}"]`)
                                   .forEach((el) => (el.style.width = value + "px"));
                           ...
                       `
               Ресайзим, работает. Но! Есть проблемы с производительностью. Коллбэк `mousemove` вызывается очень часто, и каждый раз мы делаем запрос к `Dom`-дереву. Это очень ресурсозатратно. Поэтому надо сделать так, чтобы мы не обращались к `Dom`-дереву каждый раз, а только один раз, когда начинаем ресайзить. Для этого надо находить все ячейки не внутри коллбэка на `mousemove`, а внутри коллбэка на `mousedown`. Т.е. надо найти все ячейки в колонке и сохранить их в переменную. А потом уже в коллбэке на `mousemove` менять их ширину. (так же, поменяем `document` на `this.$root`).
                   `dom.js`:
                       `
                           export class Dom {
                               ...
                               findAll(selector) {
                                   return this.nativeElement.querySelectorAll(selector);
                               }
                           }
                       `
                   `Table` => `onMousedown`:
                       `
                           ...
                           const cells = this.$root.findAll(`[data-col="${$parent.data.col}"]`);
                           ...
                           document.onmousemove = (e) => {
                               ...
                               cells.forEach((el) => (el.style.width = value + "px"));
                           ...
                       `
       6. 4. Изменяем размер рядов.
           Рядам мы не задавали дата-атрибуты, поэтому надо их задать. Для этого в методе `createRow` дадим им дата-атрибут `data-type="resizable"`:
               `table.template.js`:
                   `
                       function createRow(index, content) {
                           const resize = index ? '<div class="row-resize" data-resize="row"></div>' : ""
                           return `
                               <div class="row" data-type="resizable">
                               <div class="row-info">
                                   ${index}
                                   ${resize}
                               </div>
                               <div class="row-data">${content}</div>
                               </div>  
                           `;
                       }
                   `
               Но в классе `Table` => `onMousedown` в коллбэке на `onmousemove` мы берём поле `right` и меняем ширину ячеек. А тут мы должны менять высоту. Поэтому надо тут делать проверку `col` или `row`.
               Запишем её в переменную `type`:
                   `Table` => `onMousedown` (full):
                       `
                           onMousedown(event) {
                               if (event.target.dataset.resize) {
                                   const $resizer = $(event.target);
                                   const $parent = $resizer.closest("[data-type='resizable']");
                                   const coords = $parent.getCoords();
                                   const type = $resizer.data.resize;
                                   const cells = this.$root.findAll(`[data-col="${$parent.data.col}"]`);
                                   document.onmousemove = (e) => {
                                       if (type === "col") {
                                       const delta = e.x - coords.right;
                                       const value = coords.width + delta;
                                       $parent.nativeElement.style.width = value + "px";
                                       cells.forEach((el) => (el.style.width = value + "px"));
                                   } else {
                                       const delta = e.y - coords.bottom;
                                       const value = coords.height + delta;
                                       $parent.nativeElement.style.height = value + "px";
                                       }
                                   };
                                   document.onmouseup = () => {
                                       document.onmousemove = null;
                                   };
                               }
                           }
                       `
           * Но то, что мы используем `nativeElement` в js, это не норм. Надо создать метод `css(styles)` по аналогии с `jquery` и использовать его.
               `Dom.js`:
                   `
                       export class Dom {
                           ...
                           css(styles = {}) {
                               Object.keys(styles).forEach((key) => {
                                   this.nativeElement.style[key] = styles[key];
                               });
                           }
                       }
                   `
               `Table` => `onMousedown`:
                   `
                       ...
                       $parent.css({width: value + "px"});
                       ...
                       $parent.css({height: value + "px"});
                       ...
                   `
           *** Сейчас давайте решим проблему с ресайзером. ***
           * Когда мы ресайзим колонку или ряд, он исчезает. Так как он уходит из-под `hover`.
           Поэтому сделаем так (1. на `mousedown` ставить `opacity: 1`, а на `mouseup` - `opacity: 0`. 2. на `hover` ставить `opacity: 1 !important`):
               `Table.js`:
                   `
                       onMousedown(event) {
                           if (event.target.dataset.resize) {
                               ...
                               $resizer.css({opacity: 1});
                               ...
                               document.onmouseup = () => {
                                   document.onmousemove = null;
                                   document.onmouseup = null;
                                   $resizer.css({opacity: 0});
                               };
                           }
                       }
                   `
               `table.scss`:
                   `
                       .col-resize,
                       .row-resize {
                           ...
                           &:hover {
                               opacity: 1 !important;
                           }
                   `

           Теперь следующая проблема с ресайзером. Надо, чтобы он был как в реальном `Excel`. Когда мы ресайзим там,допустим, колонку, сначала идёт только ресайзер (не весь столбец), а потом, когда мы отпускаем мышку, весь столбец ресайзится. Так и надо сделать у нас.
               `Table.js` => `onMousedown(event)` (full):
                   `
                       onMousedown(event) {
                           if (event.target.dataset.resize) {
                               const $resizer = $(event.target);
                               const $parent = $resizer.closest("[data-type='resizable']");
                               const coords = $parent.getCoords();
                               const type = $resizer.data.resize;
                               let value;
                               $resizer.css({opacity: 1});
                               const cells = this.$root.findAll(`[data-col="${$parent.data.col}"]`);
                               document.onmousemove = (e) => {
                                   if (type === "col") {
                                       const delta = e.x - coords.right;
                                       value = coords.width + delta;
                                   } else {
                                       const delta = e.y - coords.bottom;
                                       value = coords.height + delta;
                                   }
                               };
                               document.onmouseup = () => {
                                   document.onmousemove = null;
                                   document.onmouseup = null;
                                   if (type === "col") {
                                       $parent.css({width: value + "px"});
                                       cells.forEach((el) => (el.style.width = value + "px"));
                                   } else {
                                       $parent.css({height: value + "px"});
                                   }
                                   $resizer.css({opacity: 0});
                               };
                           }
                       }
                   `
           Проверяем в браузере, ок. Только ресайзер исчезает, когда мы ресайзим. Надо менять у него свойство `right` и `bottom` у рядов и колонок соответственно.
               `Tabls.js` => `onMousedown(event)`:
                   `
                       document.onmousemove = (e) => {
                           if (type === "col") {
                               ...
                               value = coords.width + delta;
                               $resizer.css({right: -delta + "px"});      <======== New
                           } else {
                               ...
                               value = coords.height + delta;
                               $resizer.css({bottom: -delta + "px"});      <======== New
                           }
                       };
                   `
               А также, добавить ресайзеру `z-index`, чтобы он был поверх всего:
               `table.scss`:
                   `
                       .col-resize,
                       .row-resize {
                           ...
                           z-index: 1000;
                   `
               Теперь надо вернуть на значение 0 свойству `right` и `bottom` у ресайзера рядов и колонок соответственно.
                   * `Table.js` => `onMousedown(event)`:
                       `
                           ...
                           document.onmouseup = () => {
                               document.onmousemove = null;
                               document.onmouseup = null;
                               if (type === "col") {
                                   $parent.css({width: value + "px", right: 0});
                                   cells.forEach((el) => (el.style.width = value + "px"));
                               } else {
                                   $parent.css({height: value + "px", bottom: 0});
                               }
                               ...
                       `
           Теперь надо сделать так, чтобы ресайзер колонок был во всю высоту, а рядов - ширину, таблицы. Для этого для ресайзера колонок дадим ресайзеру `bottom: -5000px`, а строк - `right: -5000px`
               `Table.js`:
                   `
                       onMousedown(event) {
                           if (event.target.dataset.resize) {
                               ...
                               const sideProp = type === "col" ? "bottom" : "right";
                               ...
                               $resizer.css({
                                   opacity: 1,
                                   [sideProp]: "-5000px",
                               });
                               ...
                               document.onmouseup = () => {
                                   ...
                                   $resizer.css({ opacity: 0, [sideProp]: 0 });
                               };
                           }
                       }
                   `

           * Также нам больше не нужна переменная `cells` (удаляем её, а значение просто переносим).
               `Table.js` => `onMousedown(event)`:
                   `
                       document.onmouseup = () => {
                           ...
                           if (type === "col") {
                               ...
                               this.$root.findAll(`[data-col="${$parent.data.col}"]`).forEach((el) => (el.style.width = value + "px"));
                               ...
                   `
           *** Давайте теперь вынесим логику метода `onMousedown` в отдельный файл.  ***
               * Для  этого создадим файл `components/table/table.resize.js`.
                   `table.resize.js`:
                       `
                           import { $ } from "@core/dom";
                           export function resizeHandler($root, event) {
                               const $resizer = $(event.target);
                               const $parent = $resizer.closest("[data-type='resizable']");
                               const coords = $parent.getCoords();
                               const type = $resizer.data.resize;
                               const sideProp = type === "col" ? "bottom" : "right";
                               let value;
                               $resizer.css({
                                   opacity: 1,
                                   [sideProp]: "-5000px",
                               });
                               document.onmousemove = (e) => {
                                   if (type === "col") {
                                   const delta = e.x - coords.right;
                                   value = coords.width + delta;
                                   $resizer.css({ right: -delta + "px" });
                                   } else {
                                   const delta = e.y - coords.bottom;
                                   value = coords.height + delta;
                                   $resizer.css({ bottom: -delta + "px" });
                                   }
                               };
                               document.onmouseup = () => {
                                   document.onmousemove = null;
                                   document.onmouseup = null;
                                   if (type === "col") {
                                       $parent.css({ width: value + "px", right: 0 });
                                       $root
                                           .findAll(`[data-col="${$parent.data.col}"]`)
                                           .forEach((el) => (el.style.width = value + "px"));
                                       $resizer.css({ right: 0 });
                                   } else {
                                       $parent.css({ height: value + "px", bottom: 0 });
                                       $resizer.css({ bottom: 0 });
                                   }
                                   $resizer.css({ opacity: 0, [sideProp]: 0 });
                               };
                           }
                       `
                       `Table.js`:
                           `
                               onMousedown(event) {
                                   if (event.target.dataset.resize) {
                                      resizeHandler(this.$root, event);
                                   }
                               }
                           `
               Вынесли, красавы. Основной код стал сильно чище. Радуемся этому.
               Теперь условие `event.target.dataset.resize` тоде вынесим в отдельный файл. Только другой. Назовём его `components/table/table.functions.js`.
                   `table.functions.js`:
                       `
                           export function shouldResize(event) {
                               return event.target.dataset.resize;
                           }
                       `
                       `Table.js`:
                           `
                               import { shouldResize } from "./table.functions";
                               ...
                               onMousedown(event) {
                                   if (shouldResize(event)) {
                                       resizeHandler(this.$root, event);
                                   }
                               }
                           `
           Всё, доделали ресайзер, круто. Надо залить это всё теперь в гит.
           Делаем коммит-пуш `Finish table resize`. 
           Заходим на сайт `github`. 
               `Compare & Pull request`
               `Merge pull request`
               `Confirm merge`
           Заходми в репозиторий, видим изменения в ветке `main`.
           Возвращаемся в редактор кода. Переходим на ветку `main` и делаем `git pull`. Всё ок.

      7. Логика
          Теперь мы будем работать с выделением ячеек, навигацией, взаимосвязью между разными компонентами.
         `git checkout -b table-logic `
          * Диаграмма `TableSelection`
              В реальном Excel всегда есть выделенный элемент. Мы это сделали добавлением класса `selected` к ячейке. Он добавляем синий outline.
          Первая задача определить какая ячейка будет по умолчанию автивная.
          Можно подумать, что это происходит напрямую из Html в JS путём. Но это будет неверное построение архитектуры, т.к. логический слой (JS) будет завязан на классе.
          Классы - это для вёрстки только.
          Вещь логическая, а значит, надо ввести логическую прослойку. Т.е. надо создать класс `TableSelection`, который будет отвечать за выделение ячеек. 
          Это интерфейс, позволяющий связать логику и вид. Там будут методы по выделению одной иль нескольких ячеек, по получению выделенных ячеек (select, selectGroup, ...) и т.д.
          Посмотрим на класс `Table`. Он наследуется от класса `ExcelComponent`. Т.е. он является компонентом. 
          Не особо понятно в какой момент времени будет сохдаваться эта абстрактная прослойка `TableSelection`. Однако у класса `ExcelComponent` есть метод `init()`, который вызывается после загрузки Html.
          Поэтому мы можем создать там эту прослойку.
          Сейчас там вызывается `initDomListeners`:
            * `ExcelComponent.js`:
                `
                    export class ExcelComponent {
                        ...
                        init() {
                            this.initDomListeners();
                        }
                        ...
                    }
                `
            Поэтому реализуем свой метод `init()` в классе `Table` (надо только вызвать там родительский метод `super.init()`, чтобы осталась инициализация листенеров):
              * `Table.js`:
                  `
                      export class Table extends ExcelComponent {
                          ...
                          init() {
                              super.init();
                          }
                          ...
                      }
                  `
         Создадим файл `table/TableSelection.js`
         Судя по диаграмме тм должны быть методы `select`, `selectGroup`. А так же, нужно создать место, где мы будем хранить эти выбранные ячейки. Для этого в конструкторе создадим поле `group`
         В методе `select` мы будем принимать элемент, который мы будем выделять. А в методе `selectGroup` мы будем принимать массив элементов, которые мы будем выделять. И добавлять их в массив `group`.
                * `TableSelection.js`:
                    `
                        export class TableSelection {
                              constructor() {
                                  this.group = []
                              }
                               select($el) {
                                    this.group.push($el) 
                              }
                               selectGroup() {}
                        }
                    `
                  * Когда стартует приложение google-spreadsheet, мы должны выделить первую ячейку. Поэтому в методе `init()` класса `Table` мы должны вызвать метод `select` класса `TableSelection` и передать туда первую ячейку.
         А как нам понять какая первая ячейка? Посмотрим в devTools ячейку. У неё есть data-атрибут `data-col`. Но нет `data-row` Поэтому надо добавить `data-row` (или `data-id`), чтобы мы могли точно понять что за ячейка.
                  Добавим в метод `toCell` второй параметр `row` и передадим туда индекс ряда.
                  В файле `table.template.js` есть функция `createTable`, в которой мы вызываем `toCell`. Вот этот участок:
                  `
                    for (let i = 0; i < rowsCount; i++) {
                        const cells = new Array(colsCount)
                        .fill("")
                        .map(toCell)
                        .join("");
                        rows.push(createRow(i + 1, cells));
                    }
                  `
                  * Тут мы вызываем функцию `toCell` для каждой ячейки.
                  * Вот метод `toCell`:
                    `
                        function toCell(_, col) {
                            return `
                                <div class="cell" contenteditable data-col="${col}"></div>
                            `;
                        }
                    `
                  Т.е. мы передаём в неё индекс колонки. А нам надо передать и индекс ряда. Поэтому передадим в неё ещё один параметр `row` и передадим туда индекс ряда.
                  Как же это сделать. В цикле переменная `i` - это и есть номер ряда. Т.е. можем передать её в функцию `toCell`. 
                  Но тут есть 2 подхода как это сделать (как вызвать метод `toCell` с индексом `i`) - простой и элегантный (это 2 разных подхода)
                  Простой - заменим `map(toCell)` на `.map((_, col) => toCell(row, col))`. Где `row` - это `i`
                    * `table.template.js` => `createRow`:
                    `
                      for (let row = 0; row < rowsCount; row++) {
                          const cells = new Array(colsCount)
                              .fill("")
                              .map((_, col) => toCell(row, col))
                              .join("");
                          rows.push(createRow(row + 1, cells));
                      } 
                    `
                  В метод `toCell` теперб добавим дата-атрибут `data-row`:
                    * `table.template.js` => `toCell`:
                    `
                        function toCell(row, col) {
                            return `
                                <div class="cell" contenteditable data-col="${col}" data-row="${row}"></div>
                            `;
                        }
                    ` 
                  Смотрим в браузере в devTools, видим, что теперь у ячеек есть и `data-col`, и `data-row`. 
                  Вот и всё, собссна, решение.
                  Но есть второй более элегантный способ сделать это через замыкания. Т.к. строчка `.map((_, col) => toCell(row, col))` не очень выразительная
                  Нам надо вернуть из функции функцию.
                  Мы хотим заменить строчку `.map((_, col) => toCell(row, col))` на `.map(toCell(row))`. Т.е. функция `toCell` должна вернуть другую функцию, которая будет принимать параметр `col`.
                    * `table.template.js` => `toCell`:
                    `
                        function toCell(row) {
                            return function(_, col) {
                                return `
                                    <div class="cell" contenteditable data-col="${col}" data-row="${row}"></div>
                                `;
                            }
                        }
                    `
                  Проверяем - смотрим в devTools. Видим и `data-col`, и `data-row`. Всё ок!
                  Но сделаем-ка лучше 1 дата-атрибут `data-id`, который будет типа `row:col` (и добавим ещё `data-type="cell"`):
                      * `table.template.js` => `toCell`:
                      `
                          function toCell(row) {
                              return function(_, col) {
                                  return `
                                      <div class="cell" contenteditable data-type="cell" data-id="${row}:${col}" data-col="${col}" data-row="${row}"></div>
                                  `;
                              }
                          }
                      `
                Теперь сделаем так, чтобы по умолчанию создавался объект `TableSelection` и вызывался метод `select` с первой ячейкой.
                        * `Table.js`:
                        `
                            export class Table extends ExcelComponent {
                                ...
                              init() {
                                 super.init();
                                 this.selection = new TableSelection()
                                 const $cell = this.$root.find('[data-id="0:0"]')
                                 this.selection.select($cell)
                               }
                            }
                      `
                Напомню, что `this.$root` - это элемент класса `Dom`. А у него нет метода `find()`. Поэтому надо его добавить.
                        * `Dom.js`:
                        `
                            export class Dom {
                                ...
                                find(selector) {
                                    return $(this.nativeElement.querySelector(selector));
                                }
                            }
                        `
                Всё ок. Надо только  добавить класс `selected` выбранной ячейке.
                * С Dom-деревом у нас взаимодействует прослойка `TableSelection`. Поэтому этот класс будем добавлять именно там.
                Добавим сначала в класс-утилиту `Dom` метод `addClass` (и по аналогии `removeClass`):
                  * `Dom.js`:
                  `
                      export class Dom {
                          ...
                          addClass(className) {
                              this.nativeElement.classList.add(className);
                              return this
                          }
                           removeClass(className) {
                               this.nativeElement.classList.remove(className);
                               return this
                           }
                      }
                  `
            Проверяем в браузере. И.. о чудо. У 1 ячейки есть класс selected и, соответственно, долгожданный outline.
            * В принципе, мы сделали что хотели. Но давайте добавим ещё один хук, который будет вызываться перед `init()`, в конструкторе `ExcelComponent`. 
            Это будет метод `prepare()`. И в нём мы будем делать всё то, что надо сделать перед инициализацией компонента.
              * `ExcelComponent.js`:
              `
                  export class ExcelComponent {
                      ...
                      constructor($root, options = {}) {
                        super($root, options.listeners)
                        this.name = options.name || ''
                        this.prepare()
                      }
                    prepare() {}
                    ...
                }
            `
            Это ещё один хук, вызывающийся перед `init()`. И в нём мы будем делать всякие подготовительные вещи. Тем самым разгрузим метод `init()`
            Теперь вынесем создание объекта `TableSelection` в метод `prepare()` (из init удалим).
              * `Table.js`:
              `
                  export class Table extends ExcelComponent {
                      ...
                      prepare() {
                          this.selection = new TableSelection()
                      }
                      ...
                      init() {
                      super.init();
                      const $cell = this.$root.find('[data-id="0:0"]')
                      this.selection.select($cell)
                      } 
                  }
              `
    7.1. Выбор другой ячейки
        Теперь попробуем реализовать выбор другой ячейки. Для этого надо добавить листенер на `mouseDown`. У нас уже есть метод `onMousedown`, в котором мы реализовали ресайзер:
            * `Table.js` => `onMousedown`:
            `
                onMousedown(event) {
                    if (shouldResize(event)) {
                        resizeHandler(this.$root, event);
                    } else if (isCell(event)) {
                        const $target = $(event.target);
                        this.selection.select($target);
                    }
                }
            `
        Теперь надо реализовать метод `isCell(event)`, который будет проверять, что мы кликнули на ячейку. Для этого надо проверить, что у элемента есть дата-атрибут `data-type=cell`.
        Добавим в класс `Table` метод `isCell(event)`:
            * `Table.js`:
            `
                isCell(event) {
                    return event.target.dataset.type === "cell";
                }
            `
        Смотрим в браузере. При клике новая выбранная ячейка выделяется синим outline. Но старая не убирается. Надо это исправить.
        Для этого вынесем класс `selected` в статическую переменную `className` и содадим метод `clear()`:
            * `TableSelection.js` (full):
            `
                export class TableSelection {
                    static className = "selected";
                    constructor() {
                        this.group = [];
                    }
                    select($el) {
                        this.clear();
                        this.group.push($el);
                        $el.focus().addClass(TableSelection.className);
                    }
                    clear() {
                        this.group.forEach(($el) => $el.removeClass(TableSelection.className));
                        this.group = [];
                    }
                    selectGroup() {}
                }
            `
        Проверяем в бразуере, всё хорошо. При выборе новой ячейки старая убирается.
        Теперь надо реализовать выбор несольких ячеек. Т.е. если зажат `shift`, то мы можем выбрать несколько ячеек (прямоугольник от текущего выбранного элемента до того, на который мы кликнули) 
        Для начала сделаем проверку, был ли нжат `shift`:
            * `Table.js` => `onMousedown`:
            `
                onMousedown(event) {
                    if (shouldResize(event)) {
                        resizeHandler(this.$root, event);
                    } else if (isCell(event)) {
                        const $target = $(event.target);
                        // group selection
                        if (event.shiftKey) {
                            console.log('target cell', $target.data.id);
                        } else {
                            this.selection.select($target);
                        }
                    }
                }
            `
            * `$target` тут - это ячейка, на которую мы кликнули. А как нам взять текущую выбранную? Можно как `TableSelection.group[0]`. 
            Но это не будет корректно работать, т.к. если в группе будет несколько ячеек, то мы будем брать только первую. И высок шанс ошибки. 
            Поэтому надо сделать переменную `current` в классе `TableSelection`, который будет возвращать текущую выбранную ячейку:
            * `TableSelection.js`:
            `
                export class TableSelection {
                    ...
                  constructor() {
                      this.group = []
                      this.current = null    // New
                  }
                    ...
                  select($el) {
                      this.clear()
                      this.group.push($el)
                      $el.addClass(TableSelection.className)
                      this.current = $el    // New
                  }
                }
            `
            Выведем в консоль айдишники текущей и той, на которую мы кликнули:
            * `Table.js` => `onMousedown`:
            `
                onMousedown(event) {
                    if (shouldResize(event)) {
                        resizeHandler(this.$root, event);
                    } else if (isCell(event)) {
                        const $target = $(event.target);
                        // group selection
                        if (event.shiftKey) {
                            console.log('target cell', $target.id());
                            console.log('current cell', this.selection.current.data.id);
                        } else {
                            this.selection.select($target);
                        }
                    }
                }
            `
            Проверяем в браузере. Всё ок. В консоли при клике по ячейке с нажатым `Shift` видим айдишники текущего элемента и того, по которому мы кликнули.
            Теперь надо реализовать выбор нескольких ячеек. Для этого надо найти ячейки, которые находятся между текущей и той, на которую мы кликнули.
            Только  перед этим оптимизируем код. Не очень красиво выглядит `this.selection.current.data.id`. Поэтому создадим метод `id()` в классе `Dom`:
            * `Dom.js`:
            `
                export class Dom {
                    ...
                  id() {
                      return this.data.id;
                  }
            `
            Теперь вместо `this.selection.current.data.id` можно писать `this.selection.current.id()`:
            * `Table.js` => `onMousedown`:
            `
                onMousedown(event) {
                   ...
                        if (event.shiftKey) {
                            console.log('target cell', $target.id());
                            console.log('current cell', this.selection.current.id());
                        } else {
                            ...
                }
            `
            Проверяем в консоли. При клике с шифтом на какую-то ячейку в консоли выводятся айдишники в формате `row:col` текущей и той, на которую мы кликнули. 
            Если оставить как есть сейчас, то надо будет парвить на ходу этот айдишник, чтоб  вытащить из него номер ряда и колонки. А это ну такое.
            Поэтому изменим функцию `id()` в классе `Dom`:
            * `Dom.js`:
            `
                export class Dom {
                    ...
                  id(parse) {
                      if (parse) {
                          const parsed = this.data.id.split(":");
                          return {
                              row: +parsed[0],
                              col: +parsed[1],
                          };
                      }
                      return this.data.id;
                  }
            `
            Теперь вместо `$target.id()` и `this.selection.current.id()` можно писать `$target.id(true)` и `this.selection.current.id(true)`. И в консоли видим объект с номером ряда и колонки.
            Положим айдишники в переменные:
            * `Table.js` => `onMousedown`:
            `
                onMousedown(event) {
                   ...
                        if (event.shiftKey) {
                            const target = $target.id(true);
                            const current = this.selection.current.id(true);
                            const cols = range(current.col, target.col);
                            const rows = range(current.row, target.row);
                        } else {
                            ...
                }
            `

            Теперь мы хотим получить айдишники в виде ['0:0', '0:1', '0:1', '1:0', '1:1', '1:2'].
            Для этого сначала сохдадим метод `range`, принимающий, допустим, (3,5) и возвращающий массив [3,4,5]:
          * `TableSelection.js`:
            `
                export class TableSelection {
                    ...
                    range(start, end) {
                        if (start > end) {
                            [end, start] = [start, end];
                        }
                        return new Array(end - start + 1).fill("").map((_, index) => start + index);
                    }
                }
            `
         Теперь в переменную `ids` положим нужный нам массив:
          * `Table.js` => `onMousedown`:
            `
                onMousedown(event) {
                   ...
                        if (event.shiftKey) {
                            const target = $target.id(true);
                            const current = this.selection.current.id(true);
                            const cols = range(current.col, target.col);
                            const rows = range(current.row, target.row);
                            const ids = cols.reduce((acc, col) => {
                                rows.forEach((row) => acc.push(`${row}:${col}`));
                                return acc;
                            }, []);
                        } else {
                            ...
                }
            `
            Проверяем в консоли. Всё ок. Массив айдишников выводится.
            Теперь этот массив айдишников надо превратить в Dom-элементы и сделать их выделенными:
          * `Table.js` => `onMousedown`:
            `
                onMousedown(event) {
                   ...
                        if (event.shiftKey) {
                            ...
                            const ids = cols.reduce((acc, col) => {
                                rows.forEach((row) => acc.push(`${row}:${col}`));
                                return acc;
                            }, []);
                            const $cells = ids.map((id) => this.$root.find(`[data-id="${id}"]`));
                            this.selection.selectGroup($cells);
                        } else {
                            ...
                }
            `
            
            Теперь надо реализовать метод `selectGroup()` в классе `TableSelection`:
          * `TableSelection.js`:
            `
                export class TableSelection {
                    ...
                    selectGroup($group = []) {
                        this.clear();
                        this.group = $group;
                        this.group.forEach(($el) => $el.addClass(TableSelection.className));
                    }
                }
            `
            Проверяем в браузере. Всё ок. При клике с шифтом на ячейку выделяется прямоугольник ячеек от текущей до той, на которую мы кликнули.
          Теперь оптимизируем код.
          Вынесем функцию `range` в файл `utils.js`.
          Теперь создадим функцию `matrix` в файле `table.fuctins.js`:
          * `table.functions.js`:
            `
                export function matrix($target, $current) {
                    const target = $target.id(true);
                    const current = $current.id(true);
                    const cols = range(current.col, target.col);
                    const rows = range(current.row, target.row);
                    return cols.reduce((acc, col) => {
                        rows.forEach((row) => acc.push(`${row}:${col}`));
                        return acc;
                    }, []);
                }
            `
          * `Table.js` => `onMousedown`:
            `
                onMousedown(event) {
                   ...
                        if (event.shiftKey) {
                            const $cells = matrix($target, this.selection.current).map((id) => this.$root.find(`[data-id="${id}"]`));
                            this.selection.selectGroup($cells);
                        } else {
                            ...
                }
            `
            Проверяем в браузере. Всё ок.
            Отлично. Благодаря оптимизации кода, код компонента стал сильно меньше и удобочитаемее.

7.2. Выбор ячеек с помощью клавиатуры
    Теперь надо реализовать выбор ячеек с помощью клавиатуры.
    Сделем так - по табу мы будем переходить на следующую ячейку. По стрелкам - перемещаться в нужную сторону. По Enter - вниз.
    При нажатии на `Shift` будем делать переход на следуюшую строчку.
    Событие, которое мы добавим в файл `Table.js` - `keydown`:
    *** Далее я опишу только код, который надо добавить. А как он работает - в общем, понятно. ***
    * `Table.js`:
        `
            export class Table extends ExcelComponent {
                ...
                onKeydown(event) {
                const keys = ["Enter", "Tab", "ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"];
                const {key} = event;
                if (keys.includes(key) && !event.shiftKey) {
                    event.preventDefault();   // Для Enter (чтоб не было перехода строки, он будет с нажатым шифтом) и Tab (чтоб не было ещё одного перехода на следующий элемент) 
                    const id = this.selection.current.id(true);
                    const $next = this.$root.find(nextSelector(key, id));
                    this.selection.select($next);
                }
            }
        `
    * `table.functions.js`:
        `
            export function nextSelector(key, {col, row}) {
                const MIN_VALUE = 0;
                switch (key) {
                    case "Enter":
                    case "ArrowDown":
                        row++;
                        break;
                    case "Tab":
                    case "ArrowRight":
                        col++;
                        break;
                    case "ArrowLeft":
                        col = col - 1 < MIN_VALUE ? MIN_VALUE : col - 1;
                        break;
                    case "ArrowUp":
                        row = row - 1 < MIN_VALUE ? MIN_VALUE : row - 1;
                        break;
                }
                return `[data-id="${row}:${col}"]`;
            }
        `
    Сейчас работает, н опри переходе на другую ячейку, фокус остаётся. Надо это исправить.
    * `dom.js`:
        `
        focus() {
            this.nativeElement.focus();
            return this;
        }        
        `
    * `TableSelections.js`:
        `
            select($el) {
                this.clear();
                this.group.push($el);
                $el.focus().addClass(TableSelection.className);
                this.current = $el;
            }
        `
7.3. Как работает Observer Pattern
    На текущий момент мы много чего сделали, но, например, таблица не знает о том что происходит в Toolbar или в Formula. 
    Например, если мы в Formula ввели какое-то значение, то таблица не знает об этом. И надо как-то сделать так, чтобы таблица знала о том, что происходит в других компонентах.
    Следуюшим этапом надо связать эти компоненты. Возникает вопрос как это сделать.
    У нас будут 2 типа взаимоействия компонетов Первый - это основной (через состояние приложения). И второй - через события.
        *** Показать в браузере то, что ниже *** 
    Допустим, фокус на формуле. Пишем что-то. Во-первых, одновременно с этим написанное должно отображаться в выбранной ячейке.
    Во-вторых, при нажатии на `Enter` в формуле, фокус должен переходить на компонент таблицы. А компоненты эти вообще никак не связаны.
    Но фокус - это не состояние приложния. Тут надо воспользоваться каким-то своим событием, связывающие 2 этих компонента
    Как же нам реализовать событийное взаимодействие между компонентами?
    Для этого служит паттерн - `Observer`
        * Гуглим `Observer Pattern`. Одна из ссылок будет на сайт `https://refactoring.guru/ru/design-patterns/observer`
    Читаем суть паттерна. Там наверху есть перевод на русский. Читаем.
    Суть паттерна опишу в диаграмме `Observer Pattern`:
        * Объяснение диаграммы:
    Допустим, мы в `FormulaComponent` нажимает на `Enter` и в `TableComponent` должен произойти какой-то эффект.
    Для этого в `FormulaComponent` вызываем метод `emit(data)`. Можно без `data`. Событие будем обозначать, начиная символом `@`. Т.е. `@keydown`.
    Сейчас сы сказали, что в `FormulaComponent` произошло событие `@keydown`. И надо на это событие как-то откликнуться в `TableComponent`.
    Для этого мы берём и подписываемся на этот emitter, вызывая метод `subscribe()`. Назвать мы его можем как угодно. Например, `formula:done`. 
    Такой конвенции мы и будем придерживаться. Названия компонента, `:` и название события. Таким обрахом не булет коллизии названия.
    Таким образом в `TableComponent` мы подписываемся на событие `formula:done`. И передаём туда callback-функцию, которая будет вызываться, когда произойдёт событие `formula:done`.
    Хорощая сторона этого подхода в том, что мы не связываем жёстко `FormulaComponent` и `TableComponent`. Мы работаем через абстрактную сущность, которая делигирует всем компонентам, которые на неё подписаны.
    И логика самих компонентов не усложняется.
    Также хорошо, что это легко масштабируется. Если надо реагировать также на данное событие ещё в каком-то компоненте, то мы просто подписываемся на это событие.
    Минус в том, что когда большое приложение, то сложно понять, что происходит. Т.к. события могут быть в разных местах. И легко в них запутатьтся. 
    Т.е. для подобных целей мы будем использовать такой подход, но для остального кода мы будем использовать более высокоуровневый подход - через состояние приложения. 
7.4. Реализация Observer 
    Теперь надо реализовать этот паттерн.
    Для этого создадим класс `Emitter` в файле `core/Emitter.js` (*тут особо не прописываю объяснение, понятно их комментариев. Если что, это урок 05_12):
        * `Emitter.js`:
            `
                export class Emitter {
                    constructor() {
                        this.listeners = {};
                    }
                    // dispatch, fire, trigger
                    // Уведомляем слушателей, если они есть
                    // table.emit('table:select', {a: 1})
                    emit(event, ...args) {
                        if (!Array.isArray(this.listeners[event])) {
                            return false;
                        }
                        this.listeners[event].forEach((listener) => {
                            listener(...args);
                        });
                        return true;
                    }
                    // on, listen
                    // Подписываемся на уведомления
                    // Добавляем нового слушателя
                    // formula.subscribe('table:select', () => {})
                    subscribe(event, fn) {
                        this.listeners[event] = this.listeners[event] || [];
                        this.listeners[event].push(fn);
                        return () => {
                            this.listeners[event] = this.listeners[event].filter((listener) => listener !== fn);
                        };
                    }
                }
                const emitter = new Emitter() 
                const unsub = emitter.subscribe('Daniel', data => console.log('Sub:', data))
                emitter.emit('12321', 42)
                setTimeout(() => {
                    emitter.emit('Daniel', 'after 2 secods')
                }, 2000)
                setTimeout(() => {
                    emitter.emit('Daniel', 'after 4 secods')
                }, 4000)
                setTimeout(() => {
                    unsub()
                }, 3000)
                emitter.emit('Daniel', 42)
            `
7.5. Взаимодействие между компонентами посредством класса Emitter
    Теперь надо воспользоваться классом `Emitter` для взаимодействия между компонентами.
    Стоит начать с компонента `Excel`, где мы взаимодействуем со всеми космпонентами единоразово. `Excel` - это родитель для всех внутренних компонентов.
    Нам важно, чтоб Observer был единым (одним и тем же инстансом):
        * `Excel.js`:
            `
                export class Excel {
                    constructor(selector, options) {
                        this.$el = document.querySelector(selector);
                        this.components = options.components || [];
                        this.emitter = new Emitter();                                  New
                    }
                    getRoot() {
                        const $root = $.create("div", "excel");
                        const componentOptions = {                                     New
                            emitter: this.emitter,                                     New
                        };                                                             New
                        this.components = this.components.map((Component) => {
                            const $el = $.create("div", Component.className);
                            const component = new Component($el, componentOptions);    Edited
                            $el.html(component.toHTML());
                            $root.append($el);
                            return component;
                        });
                        return $root;
                    }
                    render() {
                        this.$el.append(this.getRoot());
                        this.components.forEach((component) => component.init());
                    }
                }
            `
    Что мы тут (выше) сделали? Мы создали инстанс класса `Emitter` и передали его в качестве параметра в каждый компонент.
    Теперь надо воспользоваться этим классом в компоненте `Formula`:
        * `Formula.js`:
            `
                export class Formula extends ExcelComponent {
                    ...
                    constructor($root, options) {      // Добавили options
                        super($root, {
                            name: "Formula",
                            listeners: ["input"],    
                            ...options,                // New
                        });
                    }
                    ...
                }
            `
    Сделаем то же самое, что в Формуле, для каждого класса компонента:
        * `Table.js`:
            `
                export class Table extends ExcelComponent {
                    ...
                    constructor($root, options) {      // Добавили options
                        super($root, {
                            name: "Table",
                            listeners: ["mousedown", "keydown"],
                            ...options,                // New
                        });
                    }
                    ...
                }
            `
        * `Toolbar.js`:
            `
                export class Toolbar extends ExcelComponent {
                    ...
                    constructor($root, options) {      // Добавили options
                        super($root, {
                            name: "Toolbar",
                            listeners: ["click"],
                            ...options,                // New
                        });
                    }
                    ...
                }
            `
        В `Header` вообще нет конструктора. Добавим его с options:
        * `Header.js`:
            `
                export class Header extends ExcelComponent {
                    ...
                    constructor($root, options) {      // Добавили options
                        super($root, {
                            name: "Header",
                            ...options,                // New
                        });
                    }
                    ...
                }
            `
        * `Table.js`:
            `
                export class Table extends ExcelComponent {
                    ...
                    constructor($root, options) {      // Добавили options
                        super($root, {
                            name: "Table",             // New
                            listeners: ["mousedown", "keydown"],
                            ...options,                // New
                        });
                    }
                    ...
                }
            `
        * `Toolbar.js`:
            `
                export class Toolbar extends ExcelComponent {
                    ...
                    constructor($root, options) {      // Добавили options
                        super($root, {
                            name: "Toolbar",       
                            listeners: ["click"],
                            ...options,                // New
                        });
                    }
                    ...
                }
            `
    Выведем в консоль `options` в классе `ExcelComponent`:
        * `ExcelComponent.js`:
            `
                export class ExcelComponent {
                    ...
                    constructor($root, options = {}) {
                        super($root, options.listeners)
                        this.name = options.name || ''
                        console.log('options', options)       // New
                        this.prepare()
                    }
                    ...
                }
            `
        Проверяем в браузере. Видим, что каждому компоненту передаётся объект `options`, в котором есть `emitter`. 
        Это инстанс класса `Emitter`, у него есть поле `listeners`, это пока пустой массив.
        Сохраним его во внутреннюю переменную `emitter`:
        * `ExcelComponent.js`:
            `
                export class ExcelComponent {
                    ...
                    constructor($root, options = {}) {
                        super($root, options.listeners)
                        this.name = options.name || ''
                        this.emitter = options.emitter    // New
                        this.prepare()
                    }
                    ...
                }
            `
        `emitter` во всех компонентах - это ссылка на один и тот же объект.
    Теперь проверим работу эмиттера и попробуем построить взаимодействие разных компонентов. Например, Formula и Table:
        * `Formula.js`:
            `
                export class Formula extends ExcelComponent {
                    ...
                    constructor($root, options) {
                        super($root, {
                            name: "Formula",
                            listeners: ["input"],
                            ...options,
                        });
                    }
                    ...
                    onInput(event) {
                        const text = event.target.textContent.trim();
                        this.$emit("formula:input", text);    // New
                    }
                    ...
                }
            `
        * `Table.js`:
            `
                export class Table extends ExcelComponent {
                    ...
                    constructor($root, options) {
                        super($root, {
                            name: "Table",
                            listeners: ["mousedown", "keydown"],
                            ...options,
                        });
                    }
                    ...
                    onKeydown(event) {
                        ...
                        if (keys.includes(key) && !event.shiftKey) {
                            ...
                            this.$emit("table:select", $next);    // New
                        }
                    }
                    ...
                }
            `
        Теперь надо подписаться на эти события в классе `Excel`:
        * `Formula.js`:
            `
            onInput(event) {
                const text = event.target.textContent.trim()
                this.emitter.emit('it is working', text)
            }            
            `   
        * `Table.js`:
            `
                init() {
                super.init();
                    const $cell = this.$root.find('[data-id="0:0"]')
                    this.selection.select($cell)
                    this.emitter.subscribe('it is working', text => {      // New
                        console.log("Table from Formula", text)            // New
                    })                                                     // New
                }            
            `    
        Проверяем в консоли. Когда пишем в формуле, видим в консоли, что в таблице выводится то, что мы пишем в формуле. 
        Значит, мы реализовали межкомпонентную взаимосвязь. Возрадуемся же этому.
        Теперь сделаем так, чтоб при печатании на формуле, менялся текст выбранной ячейки в таблице:
        * `Table.js`:
            `
                init() {
                super.init();
                    const $cell = this.$root.find('[data-id="0:0"]')
                    this.selection.select($cell)
                    this.emitter.subscribe('it is working', text => {     
                        this.selection.current.text(text)                   // New
                    })                                                    
                }            
            `
        Только метода `text` нет у класса `Dom`. Добавим его:
        * `Dom.js`:
            `
                text(text) {
                    if (typeof text === "string") {
                        this.nativeElement.textContent = text;
                        return this;
                    }
                    if (this.nativeElement.tagName.toLowerCase() === "input") {
                        return this.nativeElement.value.trim();
                    }
                    return this.nativeElement.textContent.trim();
                }            
            `
        Проверяем в браузере. Всё ок.
    Теперь займёмся удалением подписок.
    На примере Table:
        * `Table.js`:
            `
            constructor($root, options) {
                super($root, {
                    name: "Table", listeners: ["mousedown", "keydown"], ...options,
                });
                this.unsubscribers = [];  // New
            }
            ...
            init() {
                super.init();
                const $cell = this.$root.find('[data-id="0:0"]')
                this.selection.select($cell)
                const unsub = this.emitter.subscribe('it is working', text => {  // Edited
                    this.selection.current.text(text)
                })
                this.unsubscribers.push(unsub)                                  // New
            }
            ...
            destroy() {                                                         // Method destroy is new
                super.destroy();
                this.unsubscribers.forEach(unsub => unsub())
            }
            `  
        И это надо будет делать для каждого компонента. Поэтому надо сделать это автоматически.
        * Так можно, оно будет работать. Но у нас есть сво фреймворк. И мы, как хорощие программисты, хотим обобщить это. Чтоб было автоматически.
        Поэтому уберём эти изменения в `Table.js` (удаляем)
        У всех компонентов есть обзий класс `ExcelComponent`, от которого они все наследуются. Там и реализуем логику автоматической отписки.
        * Ещё одна неудобная вещь - при подписке мы всегда образаемся к переменной `emitter`. Если мы её переименуем (например, в `dispatcher`), то надо будет менять во всех компонентах.
        Поэтому надо сделать так, чтоб мы обращались к своему внутреннему методу, который будет храниться в классе `ExcelComponent`. Назовём его `$on`
        (начинается с `$`, чтоб м понимали, что мы сами создали этот метод, а не то, что он есть в классе `Emitter`):
        * `ExcelComponent.js`:
            `
                export class ExcelComponent {
                    ...
                    // Уведомляем слушателей про событие event
                    $emit(event, ...args) {
                        this.emitter.emit(event, ...args)
                    }
                    // Подписываемся на событие event
                    $on(event, fn) {
                        this.emitter.subscribe(event, fn)
                    }
                    ...
                }
            `
        * `Formula.js`:
        `
            onInput(event) {
                const text = event.target.textContent.trim()
                this.$emit('it is working', text)               // Updated
            }            
        `
        * `Table.js`:
        `
            init() {
                super.init();
                const $cell = this.$root.find('[data-id="0:0"]')
                this.selection.select($cell)
                this.$on('it is working', text => {              // Updated
                    this.selection.current.text(text)
                })
            }            
        `
    Теперь реализуем логику отписки, которую мы делали вначале в `Table.js`, только в классе `ExcelComponent`. 
    Таким образом, она будет распространяться на все компоненты.
        * `ExcelComponent.js`:
            `
                export class ExcelComponent {
                    constructor($root, options = {}) {
                        super($root, options.listeners)
                        this.name = options.name || ''
                        this.emitter = options.emitter
                        this.unsubscribers = []                     // New
                        this.prepare()
                    }
                    ...
                    // Подписываемся на событие event
                    $on(event, fn) {
                        const unsub = this.emitter.subscribe(event, fn)
                        this.unsubscribers.push(unsub)              // New
                    }
                    ...
                    // Удаляем подписки
                    destroy() {                                         // New method
                        this.unsubscribers.forEach(unsub => unsub())
                    }
                }
            `
        Теперь нам не надо прописывать в компонентах отписки, в методе `destroy` их удалять и т.д. 
        Это всё будет делать автоматически класс `ExcelComponent`, от которого наследуются все компоненты.
        Нам только надо пользоваться методами класса `ExcelComponent` - `$on` и `$emit`.
        В этом и заключается прелесть фреймворка.
        * Проверяем в браузере, ничего ли не сломалось. Всё ок.
        Теперь подумаем когда же нужно уничтожать компоненты.
        Они все отностяся к странице `Excel`. И когда мы уничтожаем страницу `Excel`, то надо уничтожать и все компоненты.
        Поэтому надо реализовать метод `destroy` в классе `Excel`:
        * `Excel.js`:
            `
                export class Excel {
                    ...
                    destroy() {                                         // New method
                        this.components.forEach(component => component.destroy())
                    }
                }
            `
        Отлично, хорошо. Сделали функуионал. 
        Давайте теперь поменяем название события на более подходящее. Например, `formula:input`
        * `Formula.js`:
            `
                onInput(event) {
                    const text = event.target.textContent.trim()
                    this.$emit('formula:input', text)               // Updated
                }            
            `
        * `Table.js`:
            `
                init() {
                    ...
                    this.$on('formula:input', text => {              // Updated
                    ...
                }            
            `
        *** Сейчас, как домашнее задание, можно дать задание сделать так, чтоб при вводе в формулу `Enter`, фокус переходил в таблицу на текущую ячейку. ***
        Чтобы обработать клик на `Enter` в Формуле (и `Tab` заодно), добавим обработчик в метод `onKeydown` в классе `Formula`:
        * `Formula.js`:
            `
                constructor($root, options) {
                ...
                    listeners: ['input', 'keydown'],                 // Добавили 'keydown'
                ...
                }
                onKeydown(event) {
                    const keys = ["Enter", "Tab"];
                    const {key} = event;
                    if (keys.includes(key)) {
                        event.preventDefault();
                        this.$emit("formula:done");               // New
                    }
                }
            `
        * `Table.js`:
            `
                init() {
                    ...
                    this.$on('formula:done', () => {              // New
                        this.selection.current.focus()             // New
                    })                                              // New
                }            
            `
    * Небольшой апдейт в методе `onInput` В `Formula.js`:
        * `Formula.js`:
            `
                onInput(event) {
                    this.$emit('formula:input', $(event.target).text())    // Updated
                }            
            `
    * Теперь надо реализовать обратное связывание. Т.е. по клику на ячейку надо передавать её контент в Формулу. И когда мы вписываем что-то в ячейке, её текст надо диспатчить в Формулу.
    Это будут 2 типа событий.
    Сначала сделаем события клика на новую ячейку:
        * `Formula.js`:
            `
            init() {                                            // New method
                super.init();
                this.$formula = this.$root.find('#formula')
                this.$on('table:select', $cell => {
                    this.$formula.text($cell.text())
                })
            }        
            ...
            toHTML() {
                ...
                <div id="formula" class="input" contenteditable spellcheck="false"></div>     // Updated (id="formula" added)
                ...
            `
        * `Table.js`:
            `
                onKeydown(event) {
                    ...
                    this.selection.select($next);
                    this.$emit('table:select', $next)            // New
                }
            `
        Проверяем в браузере. При переходе на другую ячейке через клавиши, текст ячейки вставляется в формулу.
    Теперь надо реализовать событие `input` Таблицы. Т.е. когда мы вписываем что-то в ячейку, то это должно отображаться в формуле:
        * `Table.js`:
            `
                onInput(event) {                                    // New method
                    this.$emit('table:input', $(event.target))      
                }
            `
        * `Formula.js`:
            `
                init() {
                    ...
                    this.$on('table:input', $cell => {
                        this.$formula.text($cell.text())
                    })
                }        
            `
        Проверяем в браузере. Всё ок.
    * Сейчас есть ондна проблемка. В самом начале если есть у нас какие-то данные, то они не отображаются в формуле. Т.к. мы не диспатчим событие `table:select`.
    Поэтому надо в классе `Table` в методе `init` добавить вызов метода `select` 
    (чтобы продемонстрировать это , впишем в файле `table.template.js` в методе `toCell(row)` внутрь дива контент `${col} - ${row}`):
        * `Table.js`:
            `
                init() {
                    ...
                    const $cell = this.$root.find('[data-id="0:0"]')
                    this.selection.select($cell)
                    this.$emit("table:select", $cell)                    // New
                    ...
                }
            `
        Проверяем в браузере. Всё ок.
    Сейчас у нас есть дублирование кода - строчки 
        `
            this.selection.select($cell)
            this.$emit("table:select", $cell)        
        `   
    в классе `Table` в методах `init` и `onKeydown`.
    Поэтому создадим тут метод `selectCell($cell)`
    Поменяем эти строчки в методах `init` и `onKeydown` на `this.selectCell($cell)` и `this.selectCell($next)` соответственно.
    Проверяем в браузере. ничего не сломалось. Всё ок.
    Осталось только Git Flow. Можно показать возможности среды разработки. В WebStorm есть встроенный Git. Можно кликнуть на его вкладку слева, а потом `Ctrl+D` или `Cmd+D`, откроется Diff.
    * В `Toolbar.js` есть у нас неиспользуемый листенер `click` и метод `onClick`. Удалим их.
    Делаем коммит (можно в среде разработки). Текст `Finish base table logic`




    *** Начать с урока 05_16 00:00 ***
    *** С Антоном закончил на 1191 строчке ***
    *** С Костей закончил на 1657 строчке ***
    *** Повторять закончил на 2430 строчке ***
