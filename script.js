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
}

class ItemCarrinho {
  constructor(produto, quantidade) {
    this.produto = produto;
    this.quantidade = quantidade;
  }

  get subtotal() {
    return this.produto.preco * this.quantidade;
  }
}

class Carrinho {
  constructor() {
    this.itens = [];
  }

  encontrarItem(codigo) {
    let indice = 0;
    let encontrado = null;
    while (indice < this.itens.length) {
      if (this.itens[indice].produto.codigo === codigo) {
        encontrado = this.itens[indice];
        indice = this.itens.length;
      } else {
        indice = indice + 1;
      }
    }
    return encontrado;
  }

  adicionarProduto(produto, quantidade) {
    const itemExistente = this.encontrarItem(produto.codigo);
    if (itemExistente) {
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
    const itensRestantes = [];
    for (let i = 0; i < this.itens.length; i++) {
      if (this.itens[i].produto.codigo !== codigo) {
        itensRestantes.push(this.itens[i]);
      }
    }
    this.itens = itensRestantes;
  }

  alterarQuantidade(codigo, novaQuantidade) {
    const item = this.encontrarItem(codigo);
    if (!item) {
      return false;
    }
    if (novaQuantidade <= 0) {
      this.removerProduto(codigo);
      return true;
    }
    if (novaQuantidade > item.produto.estoque) {
      return false;
    }
    item.quantidade = novaQuantidade;
    return true;
  }

  estaVazio() {
    return this.itens.length === 0;
  }

  calcularQuantidadeTotal() {
    let total = 0;
    for (let i = 0; i < this.itens.length; i++) {
      total = total + this.itens[i].quantidade;
    }
    return total;
  }

  calcularSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < this.itens.length; i++) {
      subtotal = subtotal + this.itens[i].subtotal;
    }
    return subtotal;
  }

  calcularDesconto() {
    const subtotal = this.calcularSubtotal();
    const limiteParaDesconto = 300;
    const percentualDesconto = 0.1;
    if (subtotal >= limiteParaDesconto) {
      return subtotal * percentualDesconto;
    } else {
      return 0;
    }
  }

  calcularTotal() {
    return this.calcularSubtotal() - this.calcularDesconto();
  }

  esvaziar() {
    this.itens = [];
  }
}

var produtos = [
  new Produto("HQ001", "Batman: Ano Um", "DC", 39.9, 0, "images/hq001.svg"),
  new Produto("HQ002", "Watchmen", "DC", 45.9, 6, "images/hq002.svg"),
  new Produto("HQ003", "Hellboy: Semente da Destruição", "Dark Horse", 37.9, 5, "images/hq003.svg"),
  new Produto("HQ004", "Saga", "Image", 34.9, 9, "images/hq004.svg"),
  new Produto("HQ005", "Sandman: Prelúdios e Noturnos", "DC", 52.0, 4, "images/hq005.svg"),
  new Produto("HQ006", "Invencível", "Image", 29.9, 10, "images/hq006.svg"),
  new Produto("HQ007", "V de Vingança", "DC", 42.5, 3, "images/hq007.svg")
];

const carrinho = new Carrinho();

let categoriaAtiva = "Todos";
let termoBusca = "";

const productGrid = document.getElementById("productGrid");
const categoryButtons = document.getElementById("categoryButtons");
const searchInput = document.getElementById("searchInput");
const emptySearch = document.getElementById("emptySearch");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const summaryQtd = document.getElementById("summaryQtd");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryDiscount = document.getElementById("summaryDiscount");
const summaryTotal = document.getElementById("summaryTotal");
const discountRow = document.getElementById("discountRow");
const discountHint = document.getElementById("discountHint");
const checkoutBtn = document.getElementById("checkoutBtn");
const successOverlay = document.getElementById("successOverlay");
const successDetails = document.getElementById("successDetails");
const closeSuccess = document.getElementById("closeSuccess");

const formatarPreco = (valor) => {
  return "R$ " + valor.toFixed(2).replace(".", ",");
};

function obterCategorias() {
  const lista = ["Todos"];
  for (let i = 0; i < produtos.length; i++) {
    const categoria = produtos[i].categoria;
    if (!lista.includes(categoria)) {
      lista.push(categoria);
    }
  }
  return lista;
}

function renderizarCategorias() {
  const categorias = obterCategorias();
  categoryButtons.innerHTML = "";
  for (let i = 0; i < categorias.length; i++) {
    const categoria = categorias[i];
    const botao = document.createElement("button");
    botao.className = "category-btn";
    botao.textContent = categoria;
    if (categoria === categoriaAtiva) {
      botao.classList.add("active");
    }
    botao.addEventListener("click", function () {
      categoriaAtiva = categoria;
      renderizarCategorias();
      renderizarProdutos();
    });
    categoryButtons.appendChild(botao);
  }
}

function filtrarProdutos() {
  const resultado = [];
  for (let i = 0; i < produtos.length; i++) {
    const produto = produtos[i];
    const combinaCategoria = categoriaAtiva === "Todos" || produto.categoria === categoriaAtiva;
    const combinaBusca = produto.nome.toLowerCase().includes(termoBusca.toLowerCase());
    if (combinaCategoria && combinaBusca) {
      resultado.push(produto);
    }
  }
  return resultado;
}

function criarCardProduto(produto) {
  const card = document.createElement("article");
  card.className = "product-card";

  const disponivel = produto.estaDisponivel();
  const statusTexto = disponivel ? produto.estoque + " em estoque" : "Indisponível";
  const statusClasse = disponivel ? "stock-ok" : "stock-out";

  card.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}">
    <div class="product-body">
      <span class="product-category">${produto.categoria}</span>
      <h3 class="product-name">${produto.nome}</h3>
      <span class="product-price">${formatarPreco(produto.preco)}</span>
      <span class="product-stock ${statusClasse}">${statusTexto}</span>
      <button class="add-btn" ${disponivel ? "" : "disabled"}>${disponivel ? "Adicionar ao carrinho" : "Esgotado"}</button>
    </div>
  `;

  const botaoAdicionar = card.querySelector(".add-btn");
  botaoAdicionar.addEventListener("click", function () {
    const adicionou = adicionarAoCarrinho(produto.codigo);
    if (adicionou) {
      botaoAdicionar.classList.remove("added");
      void botaoAdicionar.offsetWidth;
      botaoAdicionar.classList.add("added");
    }
  });

  return card;
}

function renderizarProdutos() {
  const listaFiltrada = filtrarProdutos();
  productGrid.innerHTML = "";

  if (listaFiltrada.length === 0) {
    emptySearch.classList.remove("hidden");
    return;
  }

  emptySearch.classList.add("hidden");

  for (let i = 0; i < listaFiltrada.length; i++) {
    const card = criarCardProduto(listaFiltrada[i]);
    card.style.animationDelay = (i * 0.06) + "s";
    productGrid.appendChild(card);
  }
}

function adicionarAoCarrinho(codigo) {
  const produto = produtos.find(function (item) {
    return item.codigo === codigo;
  });

  if (!produto || !produto.estaDisponivel()) {
    return false;
  }

  const sucesso = carrinho.adicionarProduto(produto, 1);
  if (!sucesso) {
    alert("Quantidade máxima em estoque já está no carrinho.");
    return false;
  }

  atualizarInterface();
  return true;
}

function criarLinhaCarrinho(item) {
  const linha = document.createElement("div");
  linha.className = "cart-item";

  linha.innerHTML = `
    <img src="${item.produto.imagem}" alt="${item.produto.nome}">
    <div class="cart-item-info">
      <span class="cart-item-name">${item.produto.nome}</span>
      <span class="cart-item-unit">${formatarPreco(item.produto.preco)} cada</span>
      <div class="qty-controls">
        <button class="qty-minus">-</button>
        <span class="qty-value">${item.quantidade}</span>
        <button class="qty-plus">+</button>
      </div>
      <span class="cart-item-subtotal">${formatarPreco(item.subtotal)}</span>
      <button class="remove-btn">remover</button>
    </div>
  `;

  const botaoMenos = linha.querySelector(".qty-minus");
  const botaoMais = linha.querySelector(".qty-plus");
  const botaoRemover = linha.querySelector(".remove-btn");

  botaoMenos.addEventListener("click", function () {
    carrinho.alterarQuantidade(item.produto.codigo, item.quantidade - 1);
    atualizarInterface();
  });

  botaoMais.addEventListener("click", function () {
    const conseguiu = carrinho.alterarQuantidade(item.produto.codigo, item.quantidade + 1);
    if (!conseguiu) {
      alert("Estoque insuficiente para aumentar a quantidade.");
    }
    atualizarInterface();
  });

  botaoRemover.addEventListener("click", function () {
    carrinho.removerProduto(item.produto.codigo);
    atualizarInterface();
  });

  return linha;
}

function renderizarCarrinho() {
  cartItemsEl.innerHTML = "";

  if (carrinho.estaVazio()) {
    cartEmptyMsg.classList.remove("hidden");
  } else {
    cartEmptyMsg.classList.add("hidden");
    for (let i = 0; i < carrinho.itens.length; i++) {
      const linha = criarLinhaCarrinho(carrinho.itens[i]);
      cartItemsEl.appendChild(linha);
    }
  }
}

function atualizarResumo() {
  const quantidadeTotal = carrinho.calcularQuantidadeTotal();
  const subtotal = carrinho.calcularSubtotal();
  const desconto = carrinho.calcularDesconto();
  const total = carrinho.calcularTotal();

  summaryQtd.textContent = quantidadeTotal;
  summarySubtotal.textContent = formatarPreco(subtotal);
  summaryDiscount.textContent = "- " + formatarPreco(desconto);
  summaryTotal.textContent = formatarPreco(total);

  if (desconto > 0) {
    discountRow.classList.remove("hidden");
    discountHint.textContent = "Desconto de 10% aplicado para compras acima de R$ 300,00.";
    discountHint.classList.add("glow");
  } else {
    discountRow.classList.add("hidden");
    discountHint.classList.remove("glow");
    const faltam = 300 - subtotal;
    if (subtotal > 0 && faltam > 0) {
      discountHint.textContent = "Faltam " + formatarPreco(faltam) + " para ganhar 10% de desconto.";
    } else {
      discountHint.textContent = "Compras a partir de R$ 300,00 ganham 10% de desconto.";
    }
  }

  if (cartCount.textContent !== String(quantidadeTotal)) {
    cartCount.textContent = quantidadeTotal;
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("bump");
  }
}

function atualizarInterface() {
  renderizarProdutos();
  renderizarCarrinho();
  atualizarResumo();
}

const abrirCarrinho = () => {
  cartOverlay.classList.add("open");
};

const fecharCarrinho = () => {
  cartOverlay.classList.remove("open");
};

function finalizarCompra() {
  if (carrinho.estaVazio()) {
    alert("Seu carrinho está vazio. Adicione ao menos uma HQ antes de finalizar.");
    return;
  }

  const quantidadeTotal = carrinho.calcularQuantidadeTotal();
  const total = carrinho.calcularTotal();

  successDetails.textContent = quantidadeTotal + " item(ns) confirmados, total de " + formatarPreco(total) + ". Bom proveito da leitura!";
  successOverlay.classList.add("open");

  carrinho.esvaziar();
  fecharCarrinho();
  atualizarInterface();
}

searchInput.addEventListener("input", function (evento) {
  termoBusca = evento.target.value;
  renderizarProdutos();
});

cartBtn.addEventListener("click", abrirCarrinho);
closeCart.addEventListener("click", fecharCarrinho);
cartOverlay.addEventListener("click", function (evento) {
  if (evento.target === cartOverlay) {
    fecharCarrinho();
  }
});

checkoutBtn.addEventListener("click", finalizarCompra);

closeSuccess.addEventListener("click", function () {
  successOverlay.classList.remove("open");
});

renderizarCategorias();
atualizarInterface();
