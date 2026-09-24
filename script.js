class Produto {
  constructor(codigo, nome, categoria, preco, estoque, imagem) {
    this.codigo = codigo;
    this.nome = nome;
    this.categoria = categoria;
    this.preco = preco;
    this.estoque = estoque;
    this.imagem = imagem;
  }

  estaDisponivel() {
    return this.estoque > 0;
  }

  reduzirEstoque(quantidade) {
    if (quantidade <= this.estoque) {
      this.estoque = this.estoque - quantidade;
      return true;
    }
    return false;
  }

  aumentarEstoque(quantidade) {
    this.estoque = this.estoque + quantidade;
  }
}

class ItemCarrinho {
  constructor(produto, quantidade) {
    this.produto = produto;
    this.quantidade = quantidade;
  }

  calcularSubtotal() {
    return this.produto.preco * this.quantidade;
  }
}

class Carrinho {
  constructor() {
    this.itens = [];
    this.cupom = null;
  }

  aplicarCupom(codigo) {
    const codigoNormalizado = codigo.trim().toUpperCase();
    if (codigoNormalizado === "TECHNOVA5") {
      this.cupom = codigoNormalizado;
      return true;
    }
    return false;
  }

  removerCupom() {
    this.cupom = null;
  }

  adicionarProduto(produto, quantidade) {
    let itemExistente = null;

    for (let i = 0; i < this.itens.length; i++) {
      if (this.itens[i].produto.codigo === produto.codigo) {
        itemExistente = this.itens[i];
      }
    }

    if (itemExistente !== null) {
      const novaQuantidade = itemExistente.quantidade + quantidade;
      if (novaQuantidade > produto.estoque) {
        return false;
      }
      itemExistente.quantidade = novaQuantidade;
    } else {
      if (quantidade > produto.estoque) {
        return false;
      }
      this.itens.push(new ItemCarrinho(produto, quantidade));
    }
    return true;
  }

  removerProduto(codigo) {
    this.itens = this.itens.filter((item) => item.produto.codigo !== codigo);
  }

  alterarQuantidade(codigo, novaQuantidade) {
    for (let i = 0; i < this.itens.length; i++) {
      if (this.itens[i].produto.codigo === codigo) {
        if (novaQuantidade <= 0) {
          this.removerProduto(codigo);
          return true;
        }
        if (novaQuantidade > this.itens[i].produto.estoque) {
          return false;
        }
        this.itens[i].quantidade = novaQuantidade;
        return true;
      }
    }
    return false;
  }

  calcularQuantidadeTotal() {
    let total = 0;
    let i = 0;
    while (i < this.itens.length) {
      total += this.itens[i].quantidade;
      i++;
    }
    return total;
  }

  calcularSubtotal() {
    let subtotal = 0;
    for (const item of this.itens) {
      subtotal += item.calcularSubtotal();
    }
    return subtotal;
  }

  calcularDesconto() {
    const subtotal = this.calcularSubtotal();
    let percentualDesconto = 0;

    if (subtotal >= 3000) {
      percentualDesconto += 0.10;
    }
    if (this.cupom === "TECHNOVA5") {
      percentualDesconto += 0.05;
    }

    return subtotal * percentualDesconto;
  }

  calcularTotal() {
    return this.calcularSubtotal() - this.calcularDesconto();
  }

  estaVazio() {
    return this.itens.length === 0;
  }

  limpar() {
    this.itens = [];
    this.cupom = null;
  }
}

const produtos = [
  new Produto(1, "Notebook Gamer Pro", "Informática", 4500.00, 5, "images/notebook.jpg"),
  new Produto(2, "Mouse Gamer RGB", "Informática", 150.00, 20, "images/mouse.jpg"),
  new Produto(3, "Console X-Play", "Games", 3000.00, 0, "images/console.jpg"),
  new Produto(4, "Controle Sem Fio", "Games", 250.00, 15, "images/controle.jpg"),
  new Produto(5, "Headset Gamer", "Acessórios", 350.00, 10, "images/headset.jpg"),
  new Produto(6, "Cadeira Gamer", "Acessórios", 1200.00, 3, "images/cadeira.jpg"),
];

const carrinho = new Carrinho();

let categoriaSelecionada = "Todos";
let termoBusca = "";
let criterioOrdenacao = "relevancia";
let temporizadorToast = null;
const CHAVE_ARMAZENAMENTO = "technova-carrinho";

function formatarMoeda(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function obterIniciais(nome) {
  const palavras = nome.split(" ");
  let iniciais = "";
  for (let i = 0; i < palavras.length && i < 2; i++) {
    iniciais += palavras[i].charAt(0);
  }
  return iniciais.toUpperCase();
}

function mostrarToast(mensagem, tipo = "sucesso") {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.className = "toast toast-" + tipo + " visivel";

  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => {
    toast.classList.remove("visivel");
  }, 2600);
}

function animarBadge() {
  const badge = document.getElementById("contador-carrinho");
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");
}

function obterCategorias() {
  const categorias = ["Todos"];
  for (const produto of produtos) {
    if (!categorias.includes(produto.categoria)) {
      categorias.push(produto.categoria);
    }
  }
  return categorias;
}

function renderizarCategorias() {
  const container = document.getElementById("lista-categorias");
  container.innerHTML = "";
  const categorias = obterCategorias();

  for (const categoria of categorias) {
    const botao = document.createElement("button");
    botao.className = "botao-categoria" + (categoria === categoriaSelecionada ? " ativo" : "");
    botao.textContent = categoria;
    botao.addEventListener("click", () => {
      categoriaSelecionada = categoria;
      renderizarCategorias();
      renderizarProdutos();
    });
    container.appendChild(botao);
  }
}

function filtrarProdutos() {
  const resultado = [];

  for (var i = 0; i < produtos.length; i++) {
    const produto = produtos[i];
    const combinaCategoria = categoriaSelecionada === "Todos" || produto.categoria === categoriaSelecionada;
    const combinaBusca = produto.nome.toLowerCase().includes(termoBusca.toLowerCase());

    if (combinaCategoria && combinaBusca) {
      resultado.push(produto);
    }
  }

  return resultado;
}

function ordenarProdutos(lista) {
  const copia = [...lista];

  if (criterioOrdenacao === "menor-preco") {
    copia.sort((a, b) => a.preco - b.preco);
  } else if (criterioOrdenacao === "maior-preco") {
    copia.sort((a, b) => b.preco - a.preco);
  } else if (criterioOrdenacao === "nome") {
    copia.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  return copia;
}

function criarCardProduto(produto, indice) {
  const card = document.createElement("div");
  card.className = "card-produto";
  card.style.animationDelay = (indice * 60) + "ms";

  const disponivel = produto.estaDisponivel();
  const estoqueBaixo = disponivel && produto.estoque <= 3;
  const codigoFormatado = "TN-" + String(produto.codigo).padStart(3, "0");

  card.innerHTML = `
    <div class="card-imagem-wrap" data-iniciais="${obterIniciais(produto.nome)}">
      <img class="card-imagem" src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />
      <span class="card-sku">${codigoFormatado}</span>
      ${!disponivel ? '<span class="card-selo-indisponivel">Esgotado</span>' : ""}
      ${estoqueBaixo ? `<span class="card-selo-baixo">Últimas ${produto.estoque}!</span>` : ""}
    </div>
    <div class="card-info">
      <span class="card-categoria">${produto.categoria}</span>
      <span class="card-nome">${produto.nome}</span>
      <span class="card-preco">${formatarMoeda(produto.preco)}</span>
      <span class="card-estoque ${disponivel ? "" : "indisponivel"}">
        ${disponivel ? produto.estoque + " em estoque" : "Indisponível"}
      </span>
      <button class="botao-adicionar" ${disponivel ? "" : "disabled"}>
        ${disponivel ? "Adicionar ao carrinho" : "Indisponível"}
      </button>
    </div>
  `;

  const imagem = card.querySelector(".card-imagem");
  imagem.addEventListener("load", () => imagem.classList.add("carregada"));
  imagem.addEventListener("error", () => {
    card.querySelector(".card-imagem-wrap").classList.add("sem-imagem");
    imagem.remove();
  });

  const botao = card.querySelector(".botao-adicionar");
  if (disponivel) {
    botao.addEventListener("click", () => adicionarAoCarrinho(produto.codigo));
  }

  return card;
}

function renderizarProdutos() {
  const lista = document.getElementById("lista-produtos");
  const mensagemBusca = document.getElementById("mensagem-busca");
  lista.innerHTML = "";

  const produtosFiltrados = ordenarProdutos(filtrarProdutos());

  if (produtosFiltrados.length === 0) {
    mensagemBusca.textContent = "Nenhum produto encontrado para essa busca.";
    mensagemBusca.classList.add("visivel");
    return;
  }

  mensagemBusca.textContent = "";
  mensagemBusca.classList.remove("visivel");

  for (let i = 0; i < produtosFiltrados.length; i++) {
    lista.appendChild(criarCardProduto(produtosFiltrados[i], i));
  }
}

const adicionarAoCarrinho = (codigo) => {
  const produto = produtos.find((p) => p.codigo === codigo);
  if (!produto || !produto.estaDisponivel()) {
    return;
  }
  const sucesso = carrinho.adicionarProduto(produto, 1);
  if (!sucesso) {
    mostrarToast("Quantidade máxima em estoque atingida.", "erro");
    return;
  }
  mostrarToast(produto.nome + " adicionado ao carrinho.");
  atualizarInterfaceCarrinho();
};

const aumentarQuantidade = (codigo) => {
  const item = carrinho.itens.find((i) => i.produto.codigo === codigo);
  if (!item) return;
  const sucesso = carrinho.alterarQuantidade(codigo, item.quantidade + 1);
  if (!sucesso) {
    mostrarToast("Estoque insuficiente para aumentar a quantidade.", "erro");
    return;
  }
  atualizarInterfaceCarrinho();
};

const diminuirQuantidade = (codigo) => {
  const item = carrinho.itens.find((i) => i.produto.codigo === codigo);
  if (!item) return;
  carrinho.alterarQuantidade(codigo, item.quantidade - 1);
  atualizarInterfaceCarrinho();
};

function removerDoCarrinho(codigo) {
  carrinho.removerProduto(codigo);
  atualizarInterfaceCarrinho();
}

function renderizarItensCarrinho() {
  const container = document.getElementById("itens-carrinho");
  container.innerHTML = "";

  if (carrinho.estaVazio()) {
    container.innerHTML = `
      <div class="carrinho-vazio">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.8h9.2a2 2 0 0 0 2-1.6L22 8H6"></path>
        </svg>
        <strong>Seu carrinho está vazio.</strong>
        <span>Adicione produtos para continuar.</span>
      </div>
    `;
    return;
  }

  for (const item of carrinho.itens) {
    const linha = document.createElement("div");
    linha.className = "item-carrinho";
    linha.innerHTML = `
      <div class="item-info">
        <div class="item-nome">${item.produto.nome}</div>
        <div class="item-preco">${formatarMoeda(item.produto.preco)} un. · Subtotal: ${formatarMoeda(item.calcularSubtotal())}</div>
      </div>
      <div class="item-controles">
        <button class="botao-diminuir">-</button>
        <span>${item.quantidade}</span>
        <button class="botao-aumentar">+</button>
        <button class="item-remover">🗑️</button>
      </div>
    `;

    linha.querySelector(".botao-aumentar").addEventListener("click", () => aumentarQuantidade(item.produto.codigo));
    linha.querySelector(".botao-diminuir").addEventListener("click", () => diminuirQuantidade(item.produto.codigo));
    linha.querySelector(".item-remover").addEventListener("click", () => removerDoCarrinho(item.produto.codigo));

    container.appendChild(linha);
  }
}

function atualizarBarraDesconto() {
  const meta = 3000;
  const subtotal = carrinho.calcularSubtotal();
  const progresso = Math.min((subtotal / meta) * 100, 100);
  const barra = document.getElementById("barra-desconto-preenchimento");
  const mensagem = document.getElementById("mensagem-desconto");

  barra.style.width = progresso + "%";

  if (subtotal >= meta) {
    mensagem.textContent = "Desconto de 10% aplicado no subtotal!";
    mensagem.classList.add("atingido");
  } else {
    mensagem.textContent = "Faltam " + formatarMoeda(meta - subtotal) + " para o desconto de 10%.";
    mensagem.classList.remove("atingido");
  }
}

function salvarCarrinho() {
  const dados = [];
  for (const item of carrinho.itens) {
    dados.push({ codigo: item.produto.codigo, quantidade: item.quantidade });
  }
  localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(dados));
}

function restaurarCarrinho() {
  const dadosSalvos = localStorage.getItem(CHAVE_ARMAZENAMENTO);
  if (!dadosSalvos) {
    return;
  }

  let itensSalvos = [];
  try {
    itensSalvos = JSON.parse(dadosSalvos);
  } catch (erro) {
    return;
  }

  for (const itemSalvo of itensSalvos) {
    const produto = produtos.find((p) => p.codigo === itemSalvo.codigo);
    if (produto) {
      const quantidadePossivel = Math.min(itemSalvo.quantidade, produto.estoque);
      if (quantidadePossivel > 0) {
        carrinho.adicionarProduto(produto, quantidadePossivel);
      }
    }
  }
}

function aplicarCupom() {
  const campo = document.getElementById("campo-cupom");
  const codigo = campo.value;

  if (carrinho.estaVazio()) {
    mostrarToast("Adicione produtos antes de aplicar um cupom.", "erro");
    return;
  }

  const sucesso = carrinho.aplicarCupom(codigo);
  if (sucesso) {
    mostrarToast("Cupom aplicado: 5% de desconto extra.");
    campo.value = "";
    atualizarInterfaceCarrinho();
  } else {
    mostrarToast("Cupom inválido.", "erro");
  }
}

function atualizarResumoCarrinho() {
  document.getElementById("qtd-itens").textContent = carrinho.calcularQuantidadeTotal();
  document.getElementById("valor-subtotal").textContent = formatarMoeda(carrinho.calcularSubtotal());
  document.getElementById("valor-desconto").textContent = formatarMoeda(carrinho.calcularDesconto());
  document.getElementById("valor-total").textContent = formatarMoeda(carrinho.calcularTotal());
  document.getElementById("contador-carrinho").textContent = carrinho.calcularQuantidadeTotal();
  animarBadge();
  atualizarBarraDesconto();
  salvarCarrinho();

  const botaoFinalizar = document.getElementById("botao-finalizar");
  botaoFinalizar.disabled = carrinho.estaVazio();
}

function atualizarInterfaceCarrinho() {
  renderizarItensCarrinho();
  atualizarResumoCarrinho();
  renderizarProdutos();
}

function finalizarCompra() {
  if (carrinho.estaVazio()) {
    mostrarToast("Carrinho vazio: adicione produtos antes de finalizar.", "erro");
    return;
  }

  let resumoHtml = "";
  for (const item of carrinho.itens) {
    resumoHtml += `<p>${item.quantidade}x ${item.produto.nome} — ${formatarMoeda(item.calcularSubtotal())}</p>`;
    item.produto.reduzirEstoque(item.quantidade);
  }
  resumoHtml += `<p><strong>Subtotal: ${formatarMoeda(carrinho.calcularSubtotal())}</strong></p>`;
  resumoHtml += `<p><strong>Desconto: ${formatarMoeda(carrinho.calcularDesconto())}</strong></p>`;
  resumoHtml += `<p><strong>Total pago: ${formatarMoeda(carrinho.calcularTotal())}</strong></p>`;

  document.getElementById("resumo-final").innerHTML = resumoHtml;
  document.getElementById("modal-sucesso").classList.add("visivel");

  carrinho.limpar();
  atualizarInterfaceCarrinho();
  fecharCarrinho();
}

function abrirCarrinho() {
  document.getElementById("painel-carrinho").classList.add("aberto");
  document.getElementById("overlay").classList.add("visivel");
}

function fecharCarrinho() {
  document.getElementById("painel-carrinho").classList.remove("aberto");
  document.getElementById("overlay").classList.remove("visivel");
}

function configurarEventos() {
  document.getElementById("botao-carrinho").addEventListener("click", abrirCarrinho);
  document.getElementById("fechar-carrinho").addEventListener("click", fecharCarrinho);
  document.getElementById("overlay").addEventListener("click", fecharCarrinho);
  document.getElementById("botao-finalizar").addEventListener("click", finalizarCompra);
  document.getElementById("fechar-modal").addEventListener("click", () => {
    document.getElementById("modal-sucesso").classList.remove("visivel");
  });

  document.getElementById("campo-busca").addEventListener("input", (evento) => {
    termoBusca = evento.target.value;
    renderizarProdutos();
  });

  document.getElementById("ordenar-produtos").addEventListener("change", (evento) => {
    criterioOrdenacao = evento.target.value;
    renderizarProdutos();
  });

  document.getElementById("botao-cupom").addEventListener("click", aplicarCupom);
  document.getElementById("campo-cupom").addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      aplicarCupom();
    }
  });
}

function iniciar() {
  restaurarCarrinho();
  renderizarCategorias();
  renderizarProdutos();
  atualizarInterfaceCarrinho();
  configurarEventos();
}

iniciar();
