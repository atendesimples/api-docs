AtendeSimples - Documentação da API
========

Site estático da documentação da API do Atende Simples, desenvolvido com [Slate](https://github.com/tripit/slate). Para acessar a documentação online, veja [http://atendesimples.github.io/api-docs](http://atendesimples.github.io/api-docs).

Para acesso offline, instale o Ruby 2.2.2 e siga as seguintes instruções:

1. Baixe o código-fonte do site:

  ```sh
  git clone https://github.com/atendesimples/api-docs.git
  ```

1. Instale as gems:

  ```sh
  cd api-docs
  bundle install
  ```

1. Inicie o servidor de teste:

  ```sh
  bundle exec middleman server
  ```

1. Acesse a documentação no seu browser via [http://localhost:4567/](http://localhost:4567/)

Para mais informações, consultar a documentação do [Slate](https://github.com/tripit/slate) e do [Middleman GH-Pages](https://github.com/neo/middleman-gh-pages).
