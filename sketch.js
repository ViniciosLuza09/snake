let cobra;
let tamanhoCelula = 20;
let comida;
let larguraMundo;
let alturaMundo;
let pontuacao = 0;
let velocidade = 10; // Velocidade inicial do jogo
let melhorPontuacao = 0;

function setup() {
  createCanvas(800, 600);
  larguraMundo = floor(width / tamanhoCelula);
  alturaMundo = floor(height / tamanhoCelula);
  frameRate(velocidade);
  cobra = new Cobra();
  gerarComida();
}

function gerarComida() {
  let x = floor(random(larguraMundo));
  let y = floor(random(alturaMundo));
  comida = createVector(x, y);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW && cobra.direcaoX !== 1) {
    cobra.setDirecao(-1, 0);
  } else if (keyCode === RIGHT_ARROW && cobra.direcaoX !== -1) {
    cobra.setDirecao(1, 0);
  } else if (keyCode === DOWN_ARROW && cobra.direcaoY !== -1) {
    cobra.setDirecao(0, 1);
  } else if (keyCode === UP_ARROW && cobra.direcaoY !== 1) {
    cobra.setDirecao(0, -1);
  } else if (key === 'R' || key === 'r') {
    reiniciarJogo();
  }
}

function draw() {
  background(51);
  desenharGrade();
  cobra.atualizar();
  cobra.mostrar();

  if (cobra.comer(comida)) {
    pontuacao += 10; // Incrementa a pontuação
    acelerar(); // Aumenta a velocidade do jogo
    gerarComida();
  }

  // Desenha a comida com uma aparência melhorada
  desenharMaca(comida.x * tamanhoCelula + tamanhoCelula / 2, comida.y * tamanhoCelula + tamanhoCelula / 2, tamanhoCelula * 0.8);

  // Exibe a pontuação e o melhor pontuação dentro da área visível
  fill(255);
  textSize(1.5 * tamanhoCelula);
  textAlign(LEFT, TOP);
  text('Pontuação: ' + pontuacao, 10, 10);
  text('Melhor Pontuação: ' + melhorPontuacao, 10, 43);

  if (!cobra.estaViva) {
    fimDeJogo();
  }
}

function desenharGrade() {
  stroke(40);
  for (let i = 0; i < width; i += tamanhoCelula) {
    line(i, 0, i, height);
  }
  for (let j = 0; j < height; j += tamanhoCelula) {
    line(0, j, width, j);
  }
}

function desenharMaca(x, y, diametro) {
  // Desenha a parte principal da maçã
  noStroke();
  fill(255, 0, 0);
  ellipse(x, y, diametro, diametro);

  // Desenha um gradiente para dar um efeito de brilho
  fill(200, 0, 0, 150); // Cor mais clara com transparência
  ellipse(x - diametro / 4, y - diametro / 4, diametro / 1.5, diametro / 1.5);

  // Desenha a folha da maçã
  fill(0, 128, 0);
  noStroke();
  beginShape();
  vertex(x - diametro / 4, y - diametro / 1.5);
  vertex(x - diametro / 8, y - diametro / 1.8);
  vertex(x - diametro / 6, y - diametro / 1.6);
  endShape(CLOSE);

  // Desenha o cabinho da maçã
  stroke(139, 69, 19); // Cor marrom para o cabinho
  strokeWeight(4);
  line(x, y - diametro / 2, x, y - diametro / 1.5);
}

function acelerar() {
  velocidade += 0.5; // Aumenta a velocidade do jogo
  frameRate(velocidade);
}

function fimDeJogo() {
  textSize(3 * tamanhoCelula);
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  text('FIM DE JOGO', width / 2, height / 2 - tamanhoCelula);
  textSize(2 * tamanhoCelula);
  text('Pressione R para Reiniciar', width / 2, height / 2 + tamanhoCelula);
  noLoop();

  if (pontuacao > melhorPontuacao) {
    melhorPontuacao = pontuacao; // Atualiza o melhor pontuação
  }
}

function reiniciarJogo() {
  pontuacao = 0;
  velocidade = 10; // Reseta a velocidade do jogo
  frameRate(velocidade);
  cobra = new Cobra();
  loop();
}

class Cobra {
  constructor() {
    this.corpo = [];
    this.corpo[0] = createVector(floor(larguraMundo / 2), floor(alturaMundo / 2));
    this.direcaoX = 0;
    this.direcaoY = 0;
    this.tamanho = 0;
    this.estaViva = true;
  }

  setDirecao(x, y) {
    this.direcaoX = x;
    this.direcaoY = y;
  }

  atualizar() {
    if (!this.estaViva) return;

    let cabeca = this.corpo[this.corpo.length - 1].copy();
    this.corpo.shift();
    cabeca.x += this.direcaoX;
    cabeca.y += this.direcaoY;
    this.corpo.push(cabeca);

    // Verifica se a cobra bateu nas bordas
    if (cabeca.x > larguraMundo - 1 || cabeca.x < 0 || cabeca.y > alturaMundo - 1 || cabeca.y < 0) {
      this.estaViva = false;
      return;
    }

    // Verifica se a cobra colidiu com ela mesma
    for (let i = 0; i < this.corpo.length - 1; i++) {
      let parte = this.corpo[i];
      if (parte.equals(cabeca)) {
        this.estaViva = false;
        return;
      }
    }
  }

  comer(pos) {
    let cabeca = this.corpo[this.corpo.length - 1];
    if (cabeca.x === pos.x && cabeca.y === pos.y) {
      this.tamanho++;
      this.corpo.push(createVector(cabeca.x, cabeca.y));
      return true;
    }
    return false;
  }

  mostrar() {
    for (let i = 0; i < this.corpo.length; i++) {
      let x = this.corpo[i].x * tamanhoCelula + tamanhoCelula / 2;
      let y = this.corpo[i].y * tamanhoCelula + tamanhoCelula / 2;
      let tam = tamanhoCelula * 0.9;
      
      // Adiciona sombra difusa para dar um efeito de profundidade
      noStroke();
      fill(0, 50, 0, 150); // Sombra difusa da cobra
      ellipse(x + 4, y + 4, tam, tam);

      // Adiciona um gradiente para cada segmento
      let corBase = color(0, 128, 0); // Verde base da cobra
      let corGradiente = color(0, 255, 0); // Verde claro do gradiente
      let corBorda = color(0, 100, 0); // Verde escuro para a borda
      let gradiente = map(i, 0, this.corpo.length - 1, 0, 1); // Gradiente de cor baseado no comprimento
      
      // Desenha a parte base da cobra
      noStroke();
      fill(lerpColor(corBase, corGradiente, gradiente));
      ellipse(x, y, tam, tam);

      // Desenha a borda escura ao redor da cobra
      stroke(corBorda);
      strokeWeight(2);
      noFill();
      ellipse(x, y, tam, tam);
    }
  }
}
