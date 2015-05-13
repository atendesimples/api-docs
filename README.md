Atende Simples - Documentação da API
=======================================

Site estático da documentação da API do Atende Simples, desenvolvido com [Slate](https://github.com/tripit/slate). Para acessar a documentação online, veja [http://atendesimples.github.io/api-docs](http://atendesimples.github.io/api-docs).


Acessando a documentação offline (localmente)
------------------------------

Para acessar a documentação offline, instale o Ruby 2.2.2 e siga as seguintes instruções:

1. Baixe o código-fonte do site:

  ```sh
  git clone https://github.com/atendesimples/api-docs.git
  ```

1. Instale as gems:

  ```sh
  cd api-docs
  bundle install
  ```

1. Inicie o servidor web de teste:

  ```sh
  bundle exec middleman server
  ```

1. Acesse a documentação no seu browser via [http://localhost:4567/](http://localhost:4567/)


Compilando o código
---------------------------

Para compilar os arquivos e gerar as páginas estáticas + assets, execute o comando:

```sh
rake build
```

Os arquivos estáticos serão gerados em `$[DIRETÓRIO_DO_PROJETO]/build`.


Publicando no GitHub Pages
---------------------------

Este projeto tem como dependência o [middleman-gh-pages](https://github.com/neo/middleman-gh-pages#middleman-github-pages), que disponibiliza comandos para facilitar a publicação para o GitHub Pages. Mas antes de começar, você deve [ativar o automatic generator nas configurações do projeto](https://help.github.com/articles/creating-pages-with-the-automatic-generator/). O comando seguinte compila o projeto e publica no GitHub Pages:

```sh
rake publish
```

Para mais informações, consultar a documentação do [Slate](https://github.com/tripit/slate) e do [middleman-gh-pages](https://github.com/neo/middleman-gh-pages).
