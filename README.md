#**Задание 2**

------------------

###**Структура**

Так как у некоторых объектов должны быть одинаковые методы (например, у менторов и студентов должны одинаково работать приоритизированные списки), удобно было создать родительские классы общими методами.
###Схема наследований###
![enter image description here](http://cs630619.vk.me/v630619575/27a97/C1HtSiEDj9c.jpg)

###SchoolObject###
####Родительский класс всех классов школы, работает с id объекта и именем, они должны быть у всех объектов (id нужен для сериализации, а имя естественным образом соответствует всем типам объектов)

###Person###
####Работает с приоритетами, родительский класс **Mentor** и **Student**

###**Особенности**###
Почти все properties и возвращаемые функциями значения, к которым должен иметь доступ пользователь, являются объектами классов школы, чтобы избавить его от необходимости работать с id, например, `Student.mentor` - объект класса Mentor, а `Group.members` - массив объектов класса Student.
С аргументами функций аналогично, например, аргумент функции `Group.add(student)` должен быть объектом класса Student.


###**Методы и properties**

###School###

 - `constructor(data)` - принимает сериализованные данные, инициализирует, параметр необязателен
 - `addStudent(name)` - добавляет и возвращает студента
 - `addGroup(name)` - создает и возвращает команду
 - `addMentor(name)` - добавляет возвращает ментора
 - `addTask(name, type)` - создает задание
 - `.data` {Object} - сериализованные данные школы, совместимые с JSON, readonly

### SchoolObject ###

 - `.id` {Number} - id объекта
 - `.name` {String} - имя или название

###Person###

 - `loadPriorityList(list)` - загружает массив приоритетов
 - `getPrior(person)` {Number} - возвращает номер person в приоритизированном списке this
 - `getPriors()` {Array} of {Person} - возвращает полный список приоритетов this

### Student ###

 - `setMark(task, mark)` - выставляет студенту оценку за задание task
 - `getMark(task)` {Number} - возвращает оценку за задание task
 - `getMarks()` {Array} of [ Task, {Number} ]- возвращает список всех оценок (массив пар [task, mark])
 -  `.mentor` {Mentor} - ментор студента, не определен до распределения, readonly
 - `.group` {Group} - текущая группа студента, readonly

### Group ###

 - `setMark(task, mark)` - выставляет группе оценку за задание task
 - `getMark(task)` {Number} - возвращает оценку группа за задание task
 - `getMarks()` {Array} of [ Task, {Number} ] - возвращает список всех оценок группы
 - `add(student)` - добавляет или перемещает студента в группу this
 - `remove(student)` - удаляет студента из группы this
 - `.list` {Array} of {Student} - список студентов группы this, readonly

---
###**Задача о распределении - хороший алгоритм не помешает**###
Под приоритизированным списком студента понимается список, где первый ментор - тот, к которому он больше всего хочет попасть, второй - к кому он хочет попасть, если не попадет к первому, и так далее. Для менторов - аналогично. 

Если среди менторов в приоритизированном списке студенту без разницы к кому пойти, то можно построить двудольный граф, в котором между ментором и студентом есть ребро тогда, когда они есть у друг друга в приоритизированных списках, и найти максимальное паросочетание. В оставшемся графе найти паросочетания, в которых между парой есть ребро только в одну сторону, остальных распределить произвольно.

Если менторов меньше чем студентов, то можно вместе с ребрами скопировать вершину, соответствующую ментору столько раз, сколько студентов он может принять, и решать аналогично.

Но сложность в том, что в реальности студенты наверняка знают, к кому хотят пойти больше, а к кому меньше. Поэтому у ребер будут веса, а именно, можно определить вес ребра от студента к ментору как место ментора в приоритизированном списке студента (нумерация от 0), обратные ребра - аналогично. Тогда очевидно, что наиболее выгодно найти максимальное паросочетание, в котором сумма весов всех ребер равна 0. Такое возможно не всегда, но для поиска наиболее выгодного распределения можно применить алгоритм поиска максимального паросочетания на таком графе, если определить выгодность пары каким-то числом, зависящим от веса ребра из студента в ментора, и обратного. Если брать сумму, то может получиться такая ситуация:


![enter image description here](http://cs630619.vk.me/v630619575/27abc/vdy3rAX6LdM.jpg)


Здесь в первом случае ментор у студента первый в списке, а студент у ментора - на 15 месте. Во 2 случае они оба на 8 месте. Первый вариант нежелателен - ментор останется недоволен. Поэтому пары, где одно из ребер очень большое менее выгодны, чем пары со средними весами. Этот критерий хорошо отражает функция a^2 + b^2, где a - вес ребра от студента к ментору, b - весь обратного ребра. Но возрастает она слишком быстро: пара (10,0) будет менее выгодная, чем (7,7), хотя первая пара кажется более выгодной. Если определить функцию как a^x + b^x, то при x примерно равном 1.2, при небольших числах (учеников в школе как раз до 30, а списки в реальности будут длины не более 10), можно проверить, что результат будет очень неплохим.

###**Производительность**###
Не очень важный, но приятный момент: все элементарные операции, такие как выставление оценок, добавления студента в группу, доступ к оценке за задание выполняются за O(1), а так же для их хранения используется линейное количество памяти, благодаря ECMA6 Map и Set Objects.
