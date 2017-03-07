# GoogleMaps-for-Qualtrics

Este repositorio tiene como fin implementar funciones de Google Maps en la plataforma de encuestas Qualtrics.

El código escrito en este repositorio tendrá dos opciones principales: (1) consultas en las que queremos guardar una posición del mapa y (2) consultas en las que queremos guardar un camino, es decir, multiples puntos unidos por lineas, ambas serán explicadas posteriormente.

En primer lugar, una vez abierto los mapas, lo primero que el navegador le preguntará al usuario es si le permite usar su posición, en este caso, el mapa se abrirá en la posición del usuario, en caso contrario se abrirá en una posición predeterminada por el creador de la encuesta. Posterior a ello el usuario procede a interactuar con la interfase de mapas.


# Instrucciones de Uso

1 - Crear un nuevo proyecto en la plataforma Qualtrics

2 - Crear una nueva pregunta y modificamos el texto de la pregunta de la siguiente forma:

![alt tag](http://i.imgur.com/oZFR6qw.png)

Aquí cambiamos Normal View a HTML View y escribimos lo siguiente:
```javascript
Escribe tu pregunta aquí
<a href="javascript:void(0)" onclick="initMapx();">Haz click para ir al mapa</a>
```

![alt tag](http://i.imgur.com/9Qxgtoc.png)

3 - Nos dirigimos a Ajustes -> Add Javascript, como se indica en la siguiente figura:

![alt tag](http://i.imgur.com/QKqH8MT.png)

4 - Se abrirá una ventana como la que se muestra a continuación, en ella debemos copiar y pegar el código que está en este repositorio de la siguiente forma:

![alt tag](http://i.imgur.com/tayziRb.png)

![alt tag](http://i.imgur.com/kWEyx9r.png)

5 - Luego de esto tendremos que editar el código y/o añadir Embedded Data según el tipo de consulta que queramos hacer.


# Configuración para consultas de una posición

Como se indica en la imagen, debemos especificar que typeQuery es 1:

![alt tag](http://i.imgur.com/HSuP3Tl.png)

Posteriormente, tendremos que indicar en que cuadro de texto de la pregunta queremos guardar los datos de latitud y longitud.

Supongamos que queremos hacer una form que tenga 10 informaciones distintas a ingresar, como se muestra en la figura:

![alt tag](http://i.imgur.com/vQe6M8X.png)

Y dentro de ella nos gustaría que la penultima casilla tuviese información de latitud y la ultima tuviese la longitud:

![alt tag](http://i.imgur.com/DaZaUA1.png)

Lo que tendremos que hacer en este caso es volver al Javascript y modificar los siguientes parametros:

![alt tag](http://i.imgur.com/Kyb6Mz3.png)

(Importante: notar que en el código los cuadros aparecen 0-indexados, es decir el primer cuadro correponde al indice 0, el segundo al indice 1 y así sucesivamente).

Luego guardamos.

# Configuración para consultas de caminos

En este caso, guardaremos la información mediante un Embedded Data y no mediante forms.
El Embedded Data contendra los puntos como una sucesión de pares (latitud, longitud).


Como se indica en la imagen, debemos especificar en el código que typeQuery es 2 y además poner un limite para el máximo de puntos que queremos que el camino admita:

![alt tag](http://i.imgur.com/e6KiI14.png)

Posterior a esto, debemos crear el Embedded Data que contendrá los puntos. Para ello nos dirigimos a Survey Flow:

![alt tag](http://i.imgur.com/DLCRAPB.png)

Se abrirá la siguiente ventana:

![alt tag](http://i.imgur.com/dULDdHM.png)

Una vez abierta, haremos click en Add a New Element Here, luego seleccionaremos Embbeded Data:

![alt tag](http://i.imgur.com/e1fALnQ.png)

Le pondremos como nombre Puntos y lo arrastraremos encima de la pregunta, luego haremos click en Save Flow:

![alt tag](http://i.imgur.com/mY22KVr.png)

