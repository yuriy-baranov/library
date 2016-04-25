describe('Тестирование cсериализации/деcсериализации', () => {
    
    var school;
    
    beforeEach(() => {
        school = new School();
    })
    
    
    it('Сериализация студента', () => {
        let student = school.addStudent('Виктор');
        let group = school.addGroup('Команда 1');
        group.add(student);
        let task1 = school.addTask('Индивидуальное задание 1', 0);
        let task2 = school.addTask('Индивидуальное задание 2', 0);
        student.setMark(task1, 4);
        student.setMark(task2, 5);
        let right_answer = {
            id: student.id,
            name: 'Виктор',
            marks: [[task1.id, 4], [task2.id, 5]],
            priors: [],
            group: group.id
        }
        check(student.data, right_answer);
    });
    
    it('Сериализация группы', () => {
        let student1 = school.addStudent('Виктор');
        let student2 = school.addStudent('Иван');
        let group = school.addGroup('Команда 1');
        group.add(student1);
        group.add(student2);
        let task1 = school.addTask('Групповое задание 1', 1);
        let task2 = school.addTask('Групповое задание 2', 1);
        group.setMark(task1, 4);
        group.setMark(task2, 3);
        let right_answer = {
            id: group.id,
            name: group.name,
            marks: [[0, 4], [1, 3]],
            members: [0, 1],
        }
        check(group.data, right_answer);
    });
    
    it('Сериализация приоритетов', () => {
        let student1 = school.addStudent('Виктор');
        let mentor1 = school.addMentor('Александр');
        let mentor2 = school.addMentor('Алексей');
        student1.loadPriorityList([mentor2, mentor1]);
        let right_answer = {
            id: student1.id,
            name: student1.name,
            marks: [],
            priors: [1, 0]
        }
        check(student1.data, right_answer);
    });
    
    it('Сериализация задания', () => {
        let task = school.addTask('Задание 1', 0);
        task.description = 'abacaba';
        let right_answer = {
            id: task.id,
            name: 'Задание 1',
            type: 0
        }
        check(task.data, right_answer);
    });
    
    it('Сериализация школы, создание школы по сериализованным данным, проверка десериализации', () => {
        let student = school.addStudent('Виктор');  
        let group = school.addGroup('Команда 1');
        group.add(student);
        let task1 = school.addTask('Индивидуальное задание 1', 0);
        let task2 = school.addTask('Индивидуальное задание 2', 0);
        student.setMark(task1, 4);
        student.setMark(task2, 5);
        console.log(school.data);
        let right_answer = {
            students: [{
                id: student.id,
                name: 'Виктор',
                marks: [[task1.id, 4], [task2.id, 5]],
                priors: [],
                group: group.id
            }],
            mentors: [],
            groups: [{
                id: group.id,
                name: group.name,
                marks: [],
                members: [student.id]
            }],
            tasks: [{
                id: task1.id,
                name: task1.name,
                type: task1.type
            },
            {
                id: task2.id,
                name: task2.name,
                type: task2.type
            }]
        }
        let serialized_data = school.data;
        check(serialized_data, right_answer);
        // десериализация
        school = new School(serialized_data);
        check(school.data, right_answer);
    });
    
});