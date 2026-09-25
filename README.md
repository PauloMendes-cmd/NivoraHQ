<div align="center">

# `</>` TechNova Store

**Equipamento que aguenta o replay.**

Loja virtual de tecnologia e periféricos gamer — catálogo, carrinho, cupons e checkout, tudo em HTML, CSS e JavaScript puros.

[![Live Demo](https://img.shields.io/badge/demo-online-4FD8C4?style=for-the-badge)](https://tech-nova-snowy.vercel.app/)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

[Ver demo ao vivo](https://tech-nova-snowy.vercel.app/) · [Repositório](https://github.com/PauloMendes-cmd/Tech-Nova)

</div>

---
## - Integrantes - Grupo 8
- PAULO VITOR LUCENA MENDES
- JAYME BERNARDINO DA SILVA NETO
- VALTER JUNIO LOPES XAVIER
- ISAAC BARBOSA DA SILVA
- JOÃO PEDRO CARNEIRO IBIAPINO
- VINICIUS DA SILVA ALVES


## - Sobre o projeto

**TechNova Store** é uma loja virtual fictícia focada em notebooks, periféricos e acessórios gamer. O projeto simula uma experiência de e-commerce completa — busca, filtros, ordenação, carrinho persistente e cupom de desconto — sem depender de nenhum framework ou backend: é JavaScript puro manipulando o DOM, com o "banco de dados" de produtos vivendo diretamente no código.

> Projeto acadêmico da disciplina de Programação para Web (2026).

## - Funcionalidades

- - **Carrinho de compras completo** — adicionar, aumentar/diminuir quantidade e remover itens, com validação de estoque em tempo real
- - **Busca por nome** de produto, em tempo real
- - **Filtro por categoria** (Informática, Games, Acessórios)
- - **Ordenação** por relevância, menor preço, maior preço ou nome (A–Z)
- - **Descontos automáticos**:
  - 10% de desconto no subtotal a partir de **R$ 3.000**, com barra de progresso mostrando quanto falta
  - Cupom `TECHNOVA5` para 5% de desconto adicional
- - **Persistência local** — o carrinho é salvo no `localStorage` e restaurado ao recarregar a página
- - **Controle de estoque** — produtos esgotados ficam desabilitados e itens com poucas unidades exibem o selo "Últimas X!"
- - **Feedback visual** — toasts de sucesso/erro e modal de confirmação de pedido
- - **Interface responsiva** com identidade visual própria (tipografia *Chakra Petch* + *Inter* + *JetBrains Mono*)

## - Demo

A aplicação está publicada na Vercel:

**- [tech-nova-snowy.vercel.app](https://tech-nova-snowy.vercel.app/)**

## - Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica da página |
| **CSS3** | Estilização, variáveis de tema e responsividade |
| **JavaScript (ES6+)** | Lógica de negócio, classes (`Produto`, `ItemCarrinho`, `Carrinho`) e manipulação do DOM |
| **Vercel** | Deploy e hospedagem |

Não há dependências externas além das fontes do Google Fonts — o projeto roda 100% no navegador, sem `build step`.

## - Estrutura do projeto

```
Tech-Nova/
├── index.html       # Estrutura da página (header, hero, catálogo, carrinho)
├── README.md
├── css/style.css    # Tema visual, layout e responsividade
├── js/script.js     # Classes de domínio e toda a lógica da loja
└── images/
    ├── notebook.jpg
    ├── mouse.jpg
    ├── console.jpg
    ├── controle.jpg
    ├── headset.jpg
    └── cadeira.jpg
```

## - Como rodar localmente

Por ser um projeto 100% estático, não é necessário instalar nada. Basta:

```bash
# 1. Clone o repositório
git clone https://github.com/PauloMendes-cmd/Tech-Nova.git

# 2. Entre na pasta
cd Tech-Nova

# 3. Abra o index.html no navegador
```

Ou, se preferir um servidor local (recomendado para evitar bloqueios de CORS em alguns navegadores):

```bash
npx serve .
# ou
python -m http.server 8080
```

## - Arquitetura do código

A lógica da loja é organizada em três classes principais dentro de `script.js`:

- **`Produto`** — representa um item do catálogo (código, nome, categoria, preço, estoque, imagem) e controla sua própria disponibilidade e estoque.
- **`ItemCarrinho`** — associa um produto a uma quantidade e calcula seu subtotal.
- **`Carrinho`** — gerencia a lista de itens, aplica cupons, calcula subtotal/desconto/total e persiste o estado.

O restante do arquivo cuida da renderização (cards de produto, painel do carrinho, categorias) e dos eventos de interface.

## - Cupom de teste

Para testar o desconto extra, use o cupom:

```
TECHNOVA5
```

## - Licença

Este projeto não possui uma licença definida. Sinta-se à vontade para adicionar uma (MIT é uma boa escolha para projetos acadêmicos abertos).

---

<div align="center">
  <sub>Feito com 💚 e JavaScript puro.</sub>
</div>
