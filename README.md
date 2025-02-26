# DartScore

This project is a simple lightweight dart score web application. It is built using the following technologies:

- [Vite](https://vitejs.dev/) for the build tool
- [React](https://reactjs.org/) for the UI
- [TypeScript](https://www.typescriptlang.org/) for the language
- [TailwindCSS](https://tailwindcss.com/) for the styling
- [ShadCn](https://ui.shadcn.com) for the UI design

## Installation

> Create the image

```bash
docker build -t dartscore .
```

> Run the image

```bash
docker run -d -p 7001:80 --name client-dartscore dartscore
```

> Update the image

```bash
docker stop client-dartscore
docker rm client-dartscore

docker build -t dartscore .
docker run -d -p 7001:80 --name client-dartscore dartscore
```
