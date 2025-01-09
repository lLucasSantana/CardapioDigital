document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const welcomeMessage = document.getElementById("welcome-message");
    if (welcomeMessage) {
      welcomeMessage.style.display = "none";
    }
  }, 5000);

  const welcomeMessage = document.getElementById("welcome-message");
  if (welcomeMessage) {
    welcomeMessage.addEventListener("click", () => {
      welcomeMessage.style.display = "none";
    });
  }

  const carrinho = [];
  const itensCarrinho = document.getElementById("itens-carrinho");
  const totalCarrinho = document.querySelector("#total strong");
  const btnFinalizar = document.getElementById("finalizar-pedido");
  const selectPagamento = document.querySelectorAll(".option");

  function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find((item) => item.nome === nome);
    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinho.push({ nome, preco, quantidade: 1 });
    }
    atualizarCarrinho();
  }

  function atualizarCarrinho() {
    itensCarrinho.innerHTML = "";

    if (carrinho.length === 0) {
      itensCarrinho.innerHTML = "<p>O carrinho está vazio.</p>";
    } else {
      carrinho.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item-carrinho");
        itemDiv.innerHTML = `
          <span>${item.quantidade}x ${item.nome} - R$ ${(
          item.preco * item.quantidade
        ).toFixed(2)}</span>
          <button class="remover-item" data-index="${index}">Remover</button>
        `;
        itensCarrinho.appendChild(itemDiv);
      });
    }

    const total = carrinho.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );
    totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
  }

  function removerDoCarrinho(index) {
    const item = carrinho[index];
    if (item.quantidade > 1) {
      item.quantidade -= 1;
    } else {
      carrinho.splice(index, 1);
    }
    atualizarCarrinho();
  }

  selectPagamento.forEach((option) => {
    option.addEventListener("click", function () {
      selectPagamento.forEach((opt) => opt.classList.remove("selected"));

      this.classList.add("selected");
    });
  });

  btnFinalizar.addEventListener("click", () => {
    const formaPagamento = document.querySelector(".option.selected");
    if (!formaPagamento) {
      alert("Escolha uma forma de pagamento!");
      return;
    }

    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    const formaPagamentoTexto = formaPagamento.getAttribute("data-value");
    const mensagem = carrinho
      .map(
        (item) =>
          `- ${item.nome}: R$ ${(item.preco * item.quantidade).toFixed(2)}`
      )
      .join("%0A");
    const total = carrinho.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );
    const url = `https://api.whatsapp.com/send?phone=5549999148356&text=Ol%C3%A1,%20gostaria%20de%20fazer%20um%20pedido:%0A${mensagem}%0A%0ATotal:%20R$%20${total.toFixed(
      2
    )}%0AForma%20de%20Pagamento:%20${formaPagamentoTexto}`;
    window.open(url, "_blank");
  });

  document.querySelectorAll("ul li").forEach((li) => {
    const nome = li.getAttribute("data-nome");
    const preco = parseFloat(li.getAttribute("data-preco"));
    const btn = document.createElement("button");
    btn.textContent = "Adicionar";
    btn.classList.add("adicionar-item");
    btn.addEventListener("click", () => adicionarAoCarrinho(nome, preco));
    li.appendChild(btn);
  });

  itensCarrinho.addEventListener("click", (event) => {
    if (event.target.classList.contains("remover-item")) {
      const index = event.target.getAttribute("data-index");
      removerDoCarrinho(index);
    }
  });
});
