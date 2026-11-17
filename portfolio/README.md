# Liss — portfolio

Статический сайт: `index.html` + `styles.css` + `main.js` + папка `assets/`. Без сборки и зависимостей.

## Как посмотреть локально
Открой `index.html` двойным кликом в браузере.

## Как выложить на Vercel
1. На github.com → **New repository** → имя, например `portfolio` → **Create**.
2. На странице репозитория → **uploading an existing file** → перетащи туда всё содержимое этой папки (`index.html`, `styles.css`, `main.js`, `README.md`, папку `assets`) → **Commit changes**.
3. На vercel.com → войти через GitHub → **Add New… → Project** → выбрать репозиторий → **Deploy**. Настройки менять не нужно.
4. Готово: адрес вида `portfolio-xxx.vercel.app`. Любые изменения в GitHub выкатываются на сайт сами.

## Где что править
- **Тексты EN/RU** — в начале `main.js`, объект `I18N`. Ключи совпадают с атрибутами `data-i18n` в `index.html`.
- **Ссылки About / Contact** — в `index.html`, помечены `TODO`.
- **Иконка GeologyScience** — сейчас заглушка «GS», помечена `TODO`.
- **Язык по ссылке** — `?lang=ru` или `?lang=en` в конце адреса (удобно для резюме на hh.ru).
- **Звёздочки на фоне** — функция `drawSparkles` в `main.js`: символы в `GLYPHS`, плотность — `step`.
