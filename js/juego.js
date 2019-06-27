window.onload = inicializar;
var canvas = null;
var contexto = null;

var ultimaTeclaPresionada = null;
var cuerpo = new Array();
var comida = null;
var score = 0;
var gameover = true;

var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_ENTER = 13;
// var KEY_ESC = 27;
// var KEY_FONDO = 70;

//direccion de nuestro rectangulo
var direccion = 0;
var pausa = true;
// var opciones = false;
var iCuerpo = new Image();
var iComida = new Image();
var iFondo = new Image();
var aComer = new Audio();
var aMorir = new Audio();
var imagenTitulo;
var estadoTitulo = "snake";


function inicializar() {
  imagenTitulo = document.getElementById("titulo");
  imagenTitulo.addEventListener("click", cambiarImagen);
  imagenTitulo.addEventListener("mouseover", ponerSombra);
  imagenTitulo.addEventListener("mouseout", quitarSombra);

  canvas = document.getElementById("canvas");

  //obtenemos el contexto del lienzo necesario para
  //pintar dentro del lienzo.
  contexto = canvas.getContext("2d");

  //creamos la comida
  comida = new Rectangulo(80, 80, 10, 10);
  //cargar las animaciones
  iCuerpo.src = "assets/cuerpo.png";
  iComida.src = "assets/comida.png";
  aComer.src = "assets/beep.mp3";
  aMorir.src = "assets/dies.oga";
  iFondo.src = "assets/fondo.jpg"

  //función que llame una y otra vez para que se trate de una animación
  animacion();
  repaint();
  resize();
}

function quitarSombra(event) {
  var imagen = event.target;
  imagen.style.boxShadow = "0px 0px 0px grey";
}

function ponerSombra(event) {
  var imagen = event.target;
  imagen.style.boxShadow = "5px 5px 3px grey";
}

function cambiarImagen() {
  imagenTitulo.src = "img/serpiente.jpg";
  estadoTitulo = "serpiente";
  imagenTitulo.addEventListener("click", cambiarImagen2);
}

function cambiarImagen2() {
  imagenTitulo.src = "img/snake.jpg";
  estadoTitulo = "snake";
  imagenTitulo.addEventListener("click", comprobarImagen);
}

function comprobarImagen() {
    if (estadoTitulo == "snake") {
      imagenTitulo.src = "img/serpiente.jpg";
      estadoTitulo = "serpiente";
      return;
  }
    if (estadoTitulo == "serpiente"){
      imagenTitulo.src = "img/snake.jpg";
      estadoTitulo = "snake";
      return;
    }

}

function animacion(){
  //temporizador que llama a la función cada 50 milisegundos
  //así tenemos el juego a 20 ciclos por segundo
  setTimeout(animacion, 50);
  //llamar a todas las acciones del juego
  acciones();

}

function acciones() {
  var i = 0;
  var l = 0;
  if (!pausa){
    //gameover resetear
    if (gameover) {
      reset();
    }

    //mover cuerpo, moviendolo de atrás hacia adelante
    for (i = cuerpo.length-1; i > 0; i--) {
      cuerpo[i].x = cuerpo[i - 1].x;
      cuerpo[i].y = cuerpo[i - 1].y;
    }

    //Cambiar direcciones
    if (ultimaTeclaPresionada == KEY_UP && direccion != 2) {
      direccion = 0;
    }
    if (ultimaTeclaPresionada == KEY_RIGHT && direccion != 3) {
      direccion = 1;
    }
    if (ultimaTeclaPresionada == KEY_DOWN && direccion != 0) {
      direccion = 2;
    }
    if (ultimaTeclaPresionada == KEY_LEFT && direccion != 1) {
      direccion = 3;
    }

    //Movemos rectángulo dependiendo de la dirección que se haya tomado
    if (direccion == 0) {
      cuerpo[0].y -= 10;
    }
    if (direccion == 1) {
      cuerpo[0].x += 10;
    }
    if (direccion == 2) {
      cuerpo[0].y += 10;
    }
    if (direccion == 3) {
      cuerpo[0].x -=10;
    }
    //Mirar si el rectangulo se ha salido de la pantalla
    //y regresarlo a la misma
    if (cuerpo[0].x > canvas.width - cuerpo[0].width) {
      cuerpo[0].x = 0;
    }
    if (cuerpo[0].y > canvas.height - cuerpo[0].height) {
      cuerpo[0].y = 0;
    }
    if (cuerpo[0].x < 0) {
      cuerpo[0].x = canvas.width - cuerpo[0].width;
    }
    if (cuerpo[0].y < 0) {
      cuerpo[0].y = canvas.height - cuerpo[0].height;
    }

    //comprobamos si el cuerpo choca con la cabeza
    for (i = 2, l = cuerpo.length; i < l; i++) {
      if (cuerpo[0].interseccion(cuerpo[i])) {
        gameover = true;
        pausa = true;
        aMorir.play();
      }
    }

    //comparamos si el cuerpo y la comida están en una
    //intersección y si es así agregamos un punto más
    //y cambiamos la posición de comida
    if (cuerpo[0].interseccion(comida)) {
      //hacemos crecer el cuerpo
      cuerpo.push(new Rectangulo(comida.x, comida.y, 10, 10));
      score += 1;
      comida.x = random(canvas.width / 10-1) * 10;
      comida.y = random(canvas.height / 10-1) * 10;
      aComer.play();
    }

  }
  //Cambiar juego pausado y sin pausa
  if (ultimaTeclaPresionada == KEY_ENTER) {
    pausa = !pausa; //indica que cambió su valor por el opuesto
    //ponemos a nulo si no estaría poniendo y quitando pausa sin fin
    //hasta presionar otra tecla
    ultimaTeclaPresionada = null;
  }
  // if (ultimaTeclaPresionada == KEY_ESC) {
  //   opciones = !opciones;
  //   ultimaTeclaPresionada = null;
  //   paint(contexto);
  // }
}

// function cambiarOpciones(contexto) {
//   var i = 0;
//   var l = 0;
//   if(ultimaTeclaPresionada == KEY_FONDO){
//     contexto.fillStyle = "#0f0";
//     contexto.fillRect(0, 0, canvas.width, canvas.height);
//
//   }
// }



function paint(contexto) {
  var i = 0;
  var l = 0;

  //limpiar la pantalla antes de volver a dibujar
  contexto.fillRect(0, 0, canvas.width, canvas.height);
  contexto.drawImage(iFondo, 0, 0);

  //dibujamos el cuerpo
  for (i = 0, l = cuerpo.length; i < l; i++) {
    contexto.drawImage(iCuerpo, cuerpo[i].x, cuerpo[i].y);
  }

  //dibujamos comida
  contexto.drawImage(iComida, comida.x, comida.y);

  //saber ultima tecla pulsada
  // contexto.fillText("Ultima Tecla presionada" + ultimaTeclaPresionada, 0, 20);

  //dibujar la puntuación en pantalla
  contexto.fillStyle = "#fff";
  contexto.fillText("Score: " + score, 0, 10);

  //Dibujar el texto Pausa si se activa
  if (pausa) {
    contexto.textAlign = "center";
    if (gameover) {
      contexto.fillText("GAME OVER", 150, 75);
      contexto.fillText("Pulse ENTER", 150, 85);
      contexto.fillText("No se coma a sí mismo", 150, 95);
    } else {
      contexto.fillText("PAUSA", 150, 75);
      // contexto.fillText("Opciones ESC", 150, 85);
      // if (opciones) {
      //   contexto.textAlign = "center";
      //   contexto.fillText("Cambiar fondo", 150, 85);
      // }
    }
    contexto.textAlign = "left";
  }

}

function repaint() {
  window.requestAnimationFrame(repaint);
  paint(contexto);
}

document.addEventListener("keydown", function (evt) {
  ultimaTeclaPresionada = evt.which;
  if(ultimaTeclaPresionada>=37 && ultimaTeclaPresionada<=40){
  event.preventDefault();
  }
}, false);

//indicar como queremos que inicie el juego
function reset() {
  score = 0;
  direccion = 1;
  cuerpo.length = 0;
  cuerpo.push(new Rectangulo(40, 40, 10, 10));
  cuerpo.push(new Rectangulo(0, 0, 10, 10));
  cuerpo.push(new Rectangulo(0, 0, 10, 10));
  comida.x = random(canvas.width / 10-1) * 10;
  comida.y = random(canvas.height / 10-1) * 10;
  gameover = false;
}

function resize() {
  var ancho = window.innerWidth / canvas.width;
  var alto = window.innerHeight / canvas.height;
  var escala = Math.min(alto, ancho);

  //asignamos el ancho y alto al estilo de nuestro
  //lienzo de acuerdo a la escala resultante
  canvas.style.width = (canvas.width * escala) + "px";
  canvas.style.height = (canvas.height * escala) + "px";
}

window.addEventListener("resize", resize, false);

//función para números al azar
function random(max) {
  return Math.floor(Math.random() * max);
}

function Rectangulo(x, y, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;

    //saber si está en una intersección con otro elemento
    this.interseccion = function (rect) {
        if (rect == null) {
            window.console.warn('Missing parameters on function intersects');
        } else {
            return (this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
        }
    };

    //rellenar el rectángulo
    this.fill = function (contexto) {
        if (contexto == null) {
            window.console.warn('Missing parameters on function fill');
        } else {
            contexto.fillRect(this.x, this.y, this.width, this.height);
        }
    };
}

//problema de compatibilidad
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 17);
        };
}());
