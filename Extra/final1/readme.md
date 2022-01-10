# Ejercicio final

Esta gráfica muestra el la edad de Leo DiCaprio en relación a la edad de su pareja a lo largo del tiempo. La edad de las chicas tenía que estar en una gráfica de barras, mientras que la de DiCaprio tenía que estar en una línea.
La solución implementada es una de muchas. La principal dificultad del ejercicio residía en combinar dos tipos de gráficas que utilizaban escalas distintas. Se puede resolver usando dos escalas distintas, pero las gráƒicas de líneas se pueden representar en la escala de las de barras sin mucho problema, además de que también se pueden pasar puntos y que los represente. Eso da lugar a *tres soluciones* para la gráfica de líneas. Lo que no era fácil era representar barras en líneas temporales o continuas, aunque la posibilidad existe usando herramientas más propias de un histograma, y que no considero conveniente para este caso. 

## Solución

El ejercicio incluía algunas funciones para facilitar el camino y para dar pistas. 

    const  diCaprioBirthYear = 1974;
    const  age = function(year) { return  year - diCaprioBirthYear}
    const  today = new  Date().getFullYear()
    const  ageToday = age(today)

la función age permite calcular la edad de Leonardo pasando el año, por lo que nos iba a servir para la línea (no era imprescindible, pero debería ser intuitivo de que para algo de la línea era). 

### Constantes
No deberían suponer mucho problema:

    const  width = 700;
    const  height = 500;
    const  margin = {
        'top':  50,
        'bottom':  20,
        'left':  20,
        'right':  10
    }
### Declaraciones
Tampoco deberían ser ajenas a nuestro proceso habitual.

    const  svg = d3.select('#chart').append('svg').attr("width", width).attr("height", height).attr('id', "svg")
    const  elementGroup = svg.append('g').attr('id', "elementGroup").attr('transform', `translate(${margin.left}, ${margin.top})`)
    const  axisGroup = svg.append('g').attr('id', "axisGroup")
    const  xAxisGroup = svg.append('g').attr('id', "xAxisGroup").attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
    const  yAxisGroup = svg.append('g').attr('id', "yAxisGroup").attr('transform', `translate(${margin.left}, ${margin.top})`)
### Escalas y ejes
La clave es asegurar que usamos scaleBand para el eje x y scaleLinear para el y.  Conviene observar que no usamos una escala temporal porque es más complicada y no hace falta (usando años solo). La escalas temporales son lineales y por ende requiren datos continuos, que hacen muy complicada la creación de barras. De haber usando una escala temporal, habría sido necesaria scaleBand de todas formas para las barras. 

    let  x = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1)
    let  y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
    let  xAxis = d3.axisBottom().scale(x)
    let  yAxis = d3.axisLeft().scale(y)
El resto es código bien conocido. 
### Tooltip
Posiblemente la parte más creativa del ejercicio, no habiendo solución mala. En mi caso he colocado una línea de texto arriba con los 3 campos en cuestión, todos agrupados. Su posición no varía, lo que lo hace más simple. El texto cambiará con la barra que se seleccione. 

    let  tipGroup = svg.append('g').attr('id', "tipGroup").attr('transform', `translate(${width / 2}, ${30})`)
    let  tipName = tipGroup.append('text').attr('id', "tipName").attr("x", -200)
    let  tipAge = tipGroup.append('text').attr('id', "tipAge")
    let  tipDifference = tipGroup.append('text').attr('id', "tipDifference").attr("x", 200)
### Data call
La llamada se hace de la forma habitual, el contenido de la llamada se pondrá justo debajo:

    d3.csv('data.csv').then(data=>{
### transformación de los datos
De la forma habitual.

    data.map(d  => {
	    d.year = +d.year
	    d.age = +d.age
    })

### ponemos los dominios
Para el eje x, como scaleBand es una escala de datos discretos, tenemos que pasar todos los valores que queremos que se representen (o al menos que la escala considere), mientras que para la escala lineal basta con poner el primer y último valor, ya que son datos continuos (como espera datos continuos entiende que le estamos pasando el mínimo y máximo y así toma cualquier valor en medio, mientras que con datos discretos sólo va a poder transformar datos que le hayamos pasado en el dominio). 

    x.domain(data.map(d  =>  d.year)) 
    y.domain([15, ageToday])
    
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
Para x, los años salen con un mapa de los datos.
Para y, he puesto *ageToday* de máximo y 15 de mínimo, para que las barras y la línea tengan amplitud y no lleguen hasta los bordes. 

### colores
Otras de las cosas creativas y sin soluciones malas es la forma de colorear. Una posible solución era usar el CSS, muy recomendable. Para este caso he decidido usar una escala dinámica, para enseñar otra forma de hacerlo. Para ello, necesito que las categorías sean únicas, porque quiero que cada categoría tenga un único color. En este caso, las chicas son mis categorías. 

    names = Array.from(new  Set(data.map(d=>d.name)))
Esto es una forma de crear un array con valores únicos. 

    const  colour = d3.scaleSequential().domain([0, names.length])
	    .interpolator(d3.interpolateViridis);
Usamos una escala secuencial, que recibe como dominio la longitud del array de categorías (names) y tiene como rango un interpolado de colores (una gama de colores). Con esto se asigna un nombre de dicho rango a cada índice del array del dominio. 

### las barras
Las barras se hacen con un bind de la forma habitual. Es igual que hemos visto en clase. La única particularidad es el uso de clases. 
Cosas importantes:
Los ids son únicos, es decir, no puede haber dos elementos en un mismo documento con el mismo id. 
Si queremos que varios elementos tengan el mismo id, entonces usamos class. Es lo mismo que el id, pero admite que se puedan usar en varios elementos. Además, un elemento puede tener varios ids (que no sirve para mucho) y varias clases (que sí sirve y se usa mucho). HTML interpreta el string dentro de class o de id separando por espacios, es decir, que si tengo un `id="hello world"` le estoy poniendo la clase `"hello"` y la clase`"world"`. Lo mismo ocurre con las clases. ¿Qué sucede? Pues que si decido usar los nombres de las chicas para asignar clases o ids, tengo que asegurarme de que son un único string. `class="Blake Lively"` serían dos clases y quiero una: `class="Blake_Lively"`. El separador da igual, puede ser un guión o solo quitar el espacio. 
Esto se consigue con la función replace de javascript:

    .attr('class', d  =>  `bar ${d.name.replace(" ", "_")}`)
que podemos ver en esta línea. Lo que hace es sustituir el espacio en blanco por un underscore. 

    let  bars = elementGroup.selectAll('rect').data(data)
    bars.enter().append('rect')
    .attr('class', d  =>  `bar ${d.name.replace(" ", "_")}`)
    .attr('x', d  =>  x(d.year))
    .attr('y', d  =>  y(d.age))
    .attr('width', x.bandwidth())
    .attr('height', d  =>  height - y(d.age) - margin.top - margin.bottom)
    .attr('fill', d  =>  colour(names.findIndex(name  =>  d.name == name)))
    .on('mouseover', showTip)
    .on('mouseout', hideTip)
### la linea
Donde muchos han tenido problemas. Lo primero es no usar la misma variable anterior. En clase usé elements, aquí he usado bars para las barras y line para la linea. Las variables están almacenando la información y no podemos usar la misma para ambos elementos porque funcionan de forma distinta. 
No olvidemos tampoco que no hace falta hacer enter, que hay que usar datum en lugar de data y que no hay select previo tampoco. Es mucho más sencillo que las barras, al ser un elemento único. 

    let  line = elementGroup.datum(data)
    line.append('path')
    .attr('id', 'diCaprio')
    .attr('d', d3.line()
	    .x(d  =>  x(`${d.year}`) + (x.bandwidth()/2))
	    .y(d  =>  y(age(d.year)))
    )
Otra cosa a tener en cuenta es que la linea recibe las funciones x e y para entender los puntos que le pasamos. Todo es parte del atributo, podríamos haber sacado la función linea fuera:

    let myLineFn = d3.line()
	    .x(d => x(`${d.year}`) + (x.bandwidth()/2))
		.y(d => y(age(d.year)))

y pasar luego myLineFn al atributo "d":

    .attr("d", myLineFn)
y habría funcionado igual. Quizás se vea mejor así. 
Muchos os habéis olvidado de pasar la escala a los valores que recibe la línea. Quizás porque parece que .x() y .y() ya son la escala, cuando en realidad son métodos de d3.line() dentro de los cuales hay que pasar la función escala. 

Los valores x los tomo pasando el año a la escala x

    .x(d => x(`${d.year}`))
En este caso también hemos sumado medio ancho de barra para que el punto quede centrado. 

    + (x.bandwidth()/2)
  Resultando en:
  
	.x(d => x(`${d.year}`) + (x.bandwidth()/2))
  En el eje y los valores toman la edad de DiCaprio, que es la función que he puesto al principio. Con pasar el año, ya tenemos el punto en y. 
  

    age(d.year) // da la edad de dicaprio dependiendo del año

    y(age(d.year)) // pasa la edad a la escala, obteniendo la coordenada en y
    
    .y(d => y(age(d.year))) // siendo la función completa que hay que pasar a las coordenadas de y. 
La primera "y" y la segunda son distintas. 

### *------ Aquí acaba el contenido del data call*

 ### Funciones del tooltip
En las barras hemos agregado el trigger *onmouseover* para lanzar el evento del tooltip. 

	function  showTip(d) {
		d3.selectAll('.bar').classed('soften', true)
		d3.selectAll(`.${d.name.replace(" ", "_")}`).classed('soften', false)
		tipGroup.classed('hidden', false)
		tipName.text(`Name: ${d.name}`)
		tipAge.text(`Age: ${d.age}`)
		tipDifference.text(`Age Difference: ${age(d.year) - d.age}`
	}

En mi caso, he decidido que todas las barras que no estén marcadas reduzcan la intensidad de su color. Para ello, voy a controlar su clase. Todas las barras que no estén seleccionadas obtendrán la clase "soften":
	`d3.selectAll('.bar').classed('soften', true)`

Classed permite añadir a la selección una clase concreta, y también quitarla, sin alterar el resto de clases que tengan, lo que lo hace mejor que attr, puesto que attr sustituye al completo las clases que tenga un elemento. 
Como se la he puesto a todos los elementos, ahora se la voy a quitar al que tengo seleccionado:

    d3.selectAll(`.${d.name.replace(" ", "_")}`).classed('soften', false)

Esto utiliza la d que está puesta como argumento en showTip y que pasa los datos de la barra seleccionada, para recoger el nombre de la chica y encontrar la clase. Selecciono por clase en lugar de por id usando el . en lugar del # (recordemos la primera línea de nuestro código: `const  svg = d3.select('#chart')` donde seleccionamos el elemento con el id *chart*). Así, todas las barras que tengan la clase con el nombre de la chica dejarán de tener "soften"

Soften es un estilo, que podemos encontrar en el css:

    .soften { 
	    fill-opacity: 0.1 
	}
Que cambia la opacidad de cualqueir elemento que tenga la clase soften. El punto del principio es lo que identifica que me refiero a la clase, si hubiese puesto un # estaría buscando el elemento con ese id. 

Lo mismo hago con .hidden:

    tipGroup.classed('hidden', false)
Esto sirve para no ocultar el grupo tooltip, que es básicamente el control de que se muestre o no el tooltip, que empieza por defecto oculto. 

    tipName.text(`Name: ${d.name}`)
	tipAge.text(`Age: ${d.age}`)
	tipDifference.text(`Age Difference: ${age(d.year) - d.age}`
El resto de elementos deberían ser fáciles, puesto que solo estoy controlando el texto que aparece. Uso `age(d.year)` para calcular la diferencia de edad. 

Y por último, la función *hideTip*, que hace lo contrario que *showTip*, es decir, activa la clase *hidden* para el grupo y quita *soften* de todas las barras, usando el mismo método que antes. 

	function  hideTip() {
		tipGroup.classed('hidden', true)
		d3.selectAll('.bar').classed('soften', false)
	}
    

