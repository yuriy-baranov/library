"use strict";

/**
 * Создает экземпляр школы
 * 
 * @constructor
 */
var School = function(serialized_data) {
    
    /**
     * @private
     * Массивы, в которых хранятся все объекты школы
     */
    
    let _students = [];
    let _mentors = [];
    let _groups = [];
    let _tasks = [];
    
    /**
     * Родительский класс всех классов школы,
     * Отвечает за работу с name и ID объекта
     */
 
    class SchoolObject {
        constructor(name) {
            this._name = name;
        }
        set name(name) {
            validateString(name);
            this._name = name;
        }
        get name() {
            return this._name;
        }
        set id(n) {
            if (this._id !== undefined) {
                throw new Error('Нельзя переопределять id объекта школы');
            }
            this._id = n;
        }
        get id() {
            return this._id;
        }
    }
    
        
    class Task extends SchoolObject {
        
        constructor(name, type) {
            super(name);
            this._text = '';
            this._type = type;
        }
        
        /**
         * Меняет описание задания
         * 
         * @param {String}
         */
        set description(text) {
            validateString(text);
            this._text = text;
        }
        
        get description() {
            return this._text;
        }
        
        /**
         * @returns {Number} тип задания: 0 - индивидуальное, 1 - командное
         */
        get type() {
            return this._type;
        }
        
        get data() {
            return {
                id: this.id,
                name: this.name,
                text: this.text,
                type: this.type
            }
        }
        
        init(serialized) {
            this._id = serialized.id;
            this._name = serialized.name;
            this._text = serialized.text;
            this._type = serialized.type;
        }
    }

    /**
     * Родительский класс {Student} и {Mentor}
     * Отвечает за работу с приоритизиованными списками
     */
    class Person extends SchoolObject {
        
        constructor(name) {
            super(name);
            this._priors = [];
        }
        
        /**
         * Сохраняет приоритизиованный список
         * 
         * @param {Array} приоритизиованный список,
         * состоит из объектов {Person} в порядке убывания их
         * приоритета для @this
         */
        loadPriorityList(list) {
            if (isStudent(this)) {
                validateStudentPriorityList(list);
            }
            else {
                validateMentorPriorityList(list);
            }
            this._priors = list;
        }
        
        /**
         * 
         * @param {Person}
         * @returns {Number} место person в приоритизиованном списке @this
         */
        getPrior(person) {
            if (isStudent(this)) {
                if (!isMentor(person)) {
                    throw new Error('Параметр должен быть экземпляром класса Mentor');
                }
            }
            else {
                if (!isStudent(person)) {
                    throw new Error('Параметр должен быть экземпляром класса Student');
                }
            }
            let prior = this._priors.indexOf(person);
            // Если person не найден в списке (список неполный), то считается, что он на последнем месте
            if (prior === -1) {
                prior = this._priors.length;
            }
            return prior;
        }
        
        getPriors() {
            return this._priors;
        }
        
    }
    
    class Mentor extends Person {
        constructor(name) {
            super(name);
        }
        get data() {
            return {
                id: this.id,
                name: this.name,
                priors: serializePriors(this.getPriors())
            }
        }
        init(serialized) {
            this._id = serialized.id;
            this._name = serialized.name;
            this._priors = deserializeMentorPriors(serialized.priors);
        }
    }
    
    class Student extends Person {
        
        constructor(name) {
            super(name);
            this._marks = new Map();
        }
        
        /**
         * Выставляет оценку за задание
         * 
         * @param {Task}
         * @param {Number}
         */
        setMark(task, mark) {
            validateTask(task);
            if (task.type !== 0) {
                throw new Error('Выставление оценки студенту за групповое задание не разрешено');
            }
            validateMark(mark);
            this._marks.set(task, mark);
        }
        
        /**
         * Возвращает оценку за задание
         * 
         * @param {Task}
         * @returns {Number} или null, если оценка не найдена
         */
        getMark(task) {
            validateTask(task);
            let mark = this._marks.get(task);
            return mark !== undefined ? mark : null;
        }
        
        /**
         * @returns {Array} of pairs [{Task}, {Number}] - список всех оценок @this
         */
        getMarks() {
            return mapToArray(this._marks);
        }

        get mentor() {
            return this._mentor;
        }
            
        get group() {
            return this._group;
        }
        
        setGroup(group) {
            this._group = group;
        }
         
        setMentor(mentor) {
            validateMentor(mentor);
            this._mentor = mentor;
        }
        
        get data() {
            let serialized = {
                id: this.id,
                name: this.name,
                marks: serializeMarks(this.getMarks()),
                priors: serializePriors(this.getPriors())
            };
            if (this.mentor !== undefined) {
                serialized.mentor = this.mentor.id;
            }
            if (this.group !== undefined) {
                serialized.group = this.group.id;
            }
            return serialized;
        }
        
        init(serialized) {
            this._id = serialized.id;
            this._name = serialized.name;
            this._marks = deserializeMarks(serialized.marks);
            this._group = _groups[serialized.group];
            this._mentor = _mentors[serialized.mentor];
            this._priors = deserializeStudentPriors(serialized.priors);
        }
    }
    
        
    class Group extends SchoolObject {
        
        constructor(name) {
            super(name);
            this._members = new Set();
            this._marks = new Map();
        }
        
         /**
         * Выставляет оценку за задание
         * 
         * @param {Task}
         * @param {Number}
         */
        setMark(task, mark) {
            validateTask(task);
            if (task.type !== 1) {
                throw new Error('Выставление оценки команде за индивидуальное задание не разрешено');
            }
            validateMark(mark);
            this._marks.set(task, mark);
        }
        
         /**
         * Возвращает оценку за задание
         * 
         * @param {Task}
         * @returns {Number} или null, если оценка не найдена
         */
        getMark(task) {
            validateTask(task);
            let mark = this._marks.get(task); 
            return mark !== undefined ? mark : null;
        }
        
        /**
         * @returns {Array} of pairs [{Task}, {Number}] - список всех оценок @this
         */
        getMarks() {
            return mapToArray(this._marks);
        }
        
        /**
         * Добавляет студента в группу @this
         * 
         * @param {Student}
         */
        add(student) {
            validateStudent(student);
            if (this._members.has(student)) {
                throw new Error('Студент уже находился в этой группе');
            }
            this._members.add(student);
            student.setGroup(this);
        }
        
        /**
         * Удаляет студента из группы @this
         * 
         * @param {Student}
         */
        remove(student) {
            validateStudent(student);
            if (!this._members.has(student)) {
                throw new Error('В этой группе нет такого студента');
            }
            this._members.delete(student);
            student.setGroup(undefined);
        }
        
        /**
         * @returns {Array} of {Student} список студентов группы
         */
        get list() {
            return setToArray(this._members);
        }
        
        get data() {
            let serialized = {
                id: this.id,
                name: this.name,
                marks: serializeMarks(this.getMarks()),
                members: serializeGroupList(this.list)
            };
            return serialized;
        }
        
        init(serialized) {
            this._id = serialized.id;
            this._name = serialized.name;
            this._marks = deserializeMarks(serialized.marks);
            this._members = deserializeGroupList(serialized.members);
        }
    }

    class School {
        
        /**
         * Создает новый экземпляр школы
         * 
         * @param сериализированные данные, необязательный параметр
         */
        constructor(data) {
            if (data !== undefined) {
                for (let i = 0; i < data.students.length; i++) {
                    this.addStudent();
                }
                for (let i = 0; i < data.groups.length; i++) {
                    this.addGroup();
                }
                for (let i = 0; i < data.mentors.length; i++) {
                    this.addMentor();
                }
                for (let i = 0; i < data.tasks.length; i++) {
                    this.addTask();
                }
                for (let i = 0; i < data.students.length; i++) {
                    _students[i].init(data.students[i]);
                }
                for (let i = 0; i < data.mentors.length; i++) {
                    _mentors[i].init(data.mentors[i]);
                }
                for (let i = 0; i < data.groups.length; i++) {
                    _groups[i].init(data.groups[i]);
                }
                for (let i = 0; i < data.tasks.length; i++) {
                    _tasks[i].init(data.tasks[i]);
                }
            }
        }
        
        /**
         * Создает и возвращает новый экземпляр студента
         * 
         * @param {String} имя студента
         * @returns {Student} новый объект Student
         */
        addStudent(name) {
            let student = new Student(name);
            student.id = _students.length;
            _students.push(student);
            return student;
        }
        
        /**
         * Создает и возвращает новый экземпляр ментора
         * 
         * @param {String} имя ментора
         * @returns {Mentor} новый объект Mentor
         */
        addMentor(name) {
            let mentor = new Mentor(name);
            mentor.id = _mentors.length;
            _mentors.push(mentor);
            return mentor;
        }
        
        /**
         * Создает и возвращает новый экземпляр группы
         * 
         * @param {String} название команды
         * @returns {Group} новый объект Group 
         */
        addGroup(name) {
            let group = new Group(name);
            group.id = _groups.length;
            _groups.push(group);
            return group;
        }
        
        /**
         * Создает и возвращает новый экземпляр задания
         * 
         * @param {String} название задание
         * @param {Number} тип задания: 0, если задание индивидуальное, иначе 1
         * @returns {Task} новый объект Task
         */
        addTask(name, type) {
            let task = new Task(name, type);
            task.id = _tasks.length;
            _tasks.push(task);
            return task;
        }
        
        /**
         * Возвращают копии массивов с объектами школы
         * 
         * @returns {Array} of {SchoolObject}
         */
        get students() {
            return _students.slice();
        }
        
        get mentors() {
            return _mentors.slice();
        }
        
        get groups() {
            return _groups.slice();
        }
        
        get tasks() {
            return _tasks.slice();
        }

       /**
        * Решает задачу распределения
        *
        * @returns {Array}, где a[i] - id ментора студента с id = i
        */
        dispence() {
            var pairs = solve();
            for (let id = 0; id < _students.length; id++) {
                _students[id].setMentor(_mentors[pairs[id]]);
            }
        }
        
        /**
         * Возвращает все данные школы
         * 
         * @returns {Object} совместимый с JSON
         */
        get data() {
            let data = {};
            data.students = _students.map((student) => student.data);
            data.mentors = _mentors.map((mentor) => mentor.data);
            data.groups = _groups.map((group) => group.data);
            data.tasks = _tasks.map((task) => task.data);
            return data;
        }
    }

    /**
     * Решает задачу распределения
     * 
     * @returns {Array} в a[i] записан id ментора у студента с id = i
     */
    function solve() {
        let matrix = precalc();
        let rows_pairs = hungarialAlgorithm(matrix);
        let mentors_cnt = _mentors.length;
        let ans = [];
        // замена номеров столбцов на id менторов
        for (let row = 1; row < matrix.length; row++) {
            ans[row - 1] = (rows_pairs[row] - 1) % mentors_cnt;
        }
        return ans;
    }

    /**
     * Вспомогательная функция, создает и заполняет массив заданной длины
     * 
     * @param {Number} длина массива
     * @param значение для заполнения
     */
    function createArray(n, val) {
        let arr = [];
        for (let i = 0; i < n; i++) {
            arr[i] = val;
        }
        return arr;
    }
    
    /**
     * Построение матрицы
     * 
     * @return матрица, где строки соответствуют студентам, а столбцы - менторам
     * в ячейках записана стоимость пары i строка и j столбец - сумма мест в приоритизиованных списках друг друга
     */
    function precalc() {
        let matrix = [];
        let students_cnt = _students.length;
        let mentors_cnt = _mentors.length;
        matrix[0] = createArray(mentors_cnt + 1, 0);
        for (let row = 1; row <= students_cnt; row++) {
            matrix[row] = [0];
            for (let column = 1; column <= mentors_cnt; column++) {
                let weight1 = _students[row - 1].getPrior(_mentors[column - 1]);
                let weight2 = _mentors[column - 1].getPrior(_students[row - 1]);
                matrix[row][column] = Math.pow(weight1, 1.5) + Math.pow(weight2, 1.5);
            }
        }
        // копирование столбцов, если менторов меньше студентов
        if (students_cnt > mentors_cnt) {
            let times = Math.ceil(students_cnt / mentors_cnt);
            multiplyColumns(matrix, times);
        }
        return matrix;
    }
    
    /**
     * Копирует столбцы матрицы кроме нулевого times раз
     * 
     * @param {matrix}
     * @param {Number}
     */
    function multiplyColumns(matrix, times) {
        let columns = matrix[0].length - 1;
        let rows = matrix.length;
        for (let row = 0; row < matrix.length; row++) {
            for (let column = columns + 1; column <= columns * times; columns++) {
                matrix[row][column] = matrix[row][column - columns];
            }
        }
    }
    
    /**
     * Стандартный алгоритм для нахождения максимального паросочетания минимального веса
     * Находит для каждой строки пару - столбец, строкам соответствуют студенты, столбцам - менторы
     * 
     * @param {Array} of {Array}
     * @returns {Array} где array[i] - номер столбца для строки с номером i
     */
    function hungarialAlgorithm(matrix) {
        const INF = 1000000;
        let n = matrix.length - 1;
        let m = matrix[0].length - 1;
        let row_potential = createArray(n + 1, 0);
        let column_potential = createArray(m + 1, 0);
        let pair = createArray(m + 1, 0);
        let way = createArray(m + 1, 0);
        for (let row = 1; row <= n; ++row) {
            pair[0] = row;
            let column = 0;
            let minv = createArray(m + 1, INF);
            let used = createArray(m + 1, false);
            do {
                used[column] = true;
                let i0 = pair[column],  delta = INF,  j1;
                for (let j = 1; j <= m; ++j)
                    if (!used[j]) {
                        let cur = matrix[i0][j] - row_potential[i0] - column_potential[j];
                        if (cur < minv[j]) {
                            minv[j] = cur;
                            way[j] = column;
                        }
                        if (minv[j] < delta) {
                            delta = minv[j];
                            j1 = j;
                        }
                    }
                for (let j = 0; j <= m; ++j)
                    if (used[j]) {
                        row_potential[pair[j]] += delta;
                        column_potential[j] -= delta;
                    }
                    else {
                        minv[j] -= delta;
                    }
                column = j1;
            } while (pair[column] != 0);
            do {
                let j1 = way[column];
                pair[column] = pair[j1];
                column = j1;
            } while (column);
        }
        let ans = [];
        for (let column = 1; column <= m; ++column) {
            ans[pair[column]] = column;
        }
        return ans;
    }
    
    /**
     * @private
     * Вспомогательные функции для проверки класса объекта
     * 
     * @returns {Boolean}
     */
    
    function isPerson(x) {
        return typeof x === 'object' && x instanceof Person;
    }
    
    function isStudent(x) {
        return isPerson(x) && x instanceof Student;
    }
    
    function isMentor(x) {
        return isPerson(x) && x instanceof Mentor;
    }
    
    function isGroup(x) {
        return typeof x === 'object' && x instanceof Group;
    }
    
    function isTask(x) {
        return typeof x === 'object' && x instanceof Task;
    }
    
    function isArray(x) {
        return typeof x === 'object' && x instanceof Array;
    }
    
    
    /**
     * @private
     * Функции, проверяющие валидность
     * 
     * Выбрасывают исключения, если данные не соответствуют формату
     */
    function validateMark(mark) {
        if (typeof mark !== 'number') {
            throw new Error('Оценка должна быть числом');
        }
        if (mark < 2 || mark > 5 || Math.floor(mark) !== mark) {
            throw new Error('Оценка должна быть целым числом от 2 до 5');
        }
    }
    function validateStudent(x) {
        if (!isStudent(x)) {
            throw new Error('Неверный формат студента');
        }
    }
    function validateTask(x) {
        if (!isTask(x)) {
            throw new Error('Неверный формат задания');
        }
    }
    function validateGroup(x) {
        if (!isGroup(x)) {
            throw new Error('Неверный формат группы');
        }
    }
    function validateMentor(x) {
        if (!isMentor(x)) {
            throw new Error('Неверный формат ментора');
        }
    }
    
    function validateString(x) {
        if (typeof x !== 'string') {
            throw new Error('Переменная не является строкой: ', x);
        }
    }
    
    /**
     * @private
     * Проверяет уникальность элементов в массиве
     * 
     * @param {Array}
     * @returns {Boolean} true, если все элементы уникальны, false иначе 
     */
    function checkElementsUnicity(array) {
        let used = new Set();
        array.forEach((item) => {
            if (used.has(item)) {
                return false;
            }
        });
        return true;
    }
    
    /**
     * @private
     * Проверяет приоритизиованный список студента на валидность
     * 
     */
    function validateStudentPriorityList(list) {
        if (!isArray(list)) {
            throw new Error('приоритизированный список должен быть массивом');
        }
        let non_mentor = list.find((element) => !isMentor(element));
        if (non_mentor !== undefined) {
            throw new Error('В приоритизиованном списке студента найден элемент, не являющийся ментором: ', non_mentor);
        }
        if (!checkElementsUnicity) {
            throw new Error('Не все менторы в списке уникальны');
        }
    }
    
    /**
     * @private
     * Проверяет приоритизиованный список ментора на валидность
     * 
     */
    function validateMentorPriorityList(list) {
        if (!isArray(list)) {
            throw new Error('приоритизированный список должен быть массивом');
        }
        let non_student = list.find((element) => !isStudent(element));
        if (non_student !== undefined) {
            throw new Error('В приоритизиованном списке ментора найден элемент, не являющийся студентом: ', non_mentor);
        }
        if (!checkElementsUnicity) {
            throw new Error('Не все студенты в списке уникальны');
        }
    }
      
    /**
     * @private
     * Конвертирует {Map Object} в {Array}
     * 
     * @param {Map Object} - объект, который нужно сконвертировать
     * @returns {Array} of [key, value]
     */
    function mapToArray(map) {
        let arr = [];
        map.forEach((value, key) => arr.push([key, value]));
        return arr;
    }

    /**
     * @private
     * Конвертирует {Array} в {Map Object} 
     * 
     * @param {Array} of [key, value]
     * @returns {Map Object} - соответствует массиву
     */
    function arrayToMap(arr) {
        let map = new Map();
        arr.forEach((value) => map.set(value[0], value[1]));
        return map;
    }

    /** 
     * @private
     * Конвертирует {Set Object} в {Array}
     * 
     * @param {Set Object}
     * @returns {Array} состоит из элементов сета
     */
    function setToArray(set) {
        let arr = [];
        set.forEach((value) => arr.push(value));
        return arr;
    }

    /**
     * @private
     * Ковертирует {Array} в {Set Object}
     * 
     * @param {Array}
     * @returns {Set Object} состоит из элементов массива
     */
    function arrayToSet(arr) {
        let set = new Set();
        arr.forEach((value) => set.add(value));
        return set;
    }
    
    /**
     * Заменяет в задания на их id
     * 
     * @param {Array} of [task, mark]
     * @returns {Array} of [task_id, mark]
     */
    function serializeMarks(marks) {
        const TASK = 0;
        return marks.map((pair) => {
            pair[TASK] = pair[TASK].id;
            return pair;
        })
    }
    
    /**
     * В списке оценок заменяет номера заданий на задания
     */
    function deserializeMarks(marks) {
        let map = new Map();
        marks.forEach((pair) => {
            let task_id = pair[0];
            let mark = pair[1];
            map.set(_tasks[task_id], mark);
        })
        return map;
    }
    
    /**
     * Set студентов группы заменяет списком их номеров
     * 
     * @param {Set} of {Student}
     * @returns {Array} of {Number}
     */
    function serializeGroupList(set_of_members) {
        let members = setToArray(set_of_members);
        return members.map((student) => student.id);
    }
    
    /**
     * Заменяет список номеров студентов на Set из их объектов
     * 
     * @param {Array} of {Number}
     * @returns {Set} of {Student}
     */
    function deserializeGroupList(members_ids) {
        let members = members_ids.map((id) => _students[id]);
        return arrayToSet(members);
    }
    
    function serializePriors(priors) {
        return priors.map((person) => person.id);
    }
    
    function deserializeStudentPriors(list) {
        return list.map((mentor_id) => _mentors[mentor_id]);
    }
    
    function deserializeMentorPriors(list) {
        return list.map((student_id) => _students[student_id]);
    }
    
    return new School(serialized_data);
    
}