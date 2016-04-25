describe('Тестирование класса Group', () => {
    var school, group, task;
    
     beforeEach(function() {
        school = new School();
        group = school.addGroup('Команда 1');
        task = school.addTask('Задание 1', 1);
    });
    
    it('Group.name - название команды', () => {
        let group = school.addGroup('Команда 1');
        check(group.name, 'Команда 1');
    });
    
    it('Group.id - возвращает id команды', () => {
        let group = school.addGroup('Команда 1');
        // id так же является порядковым номером в массиве групп школы
        check(school.groups[group.id], group);
    });
    
    it('Group.setMark(task, mark) - выставляет команде оценку за задание', () => {
        let task = school.addTask('Задание 1', 1);
        group.setMark(task, 5);
        check(group.getMarks(), [[task, 5]]);
    });
    
    it('Group.getMark(task) - возвращает оценку команды за задание, или null, если она не выставлена', () => {
        check(group.getMark(task), null);
        group.setMark(task, 4);
        check(group.getMark(task), 4);
    });
    
    it('Group.getMarks() - возвращает список оценок', () => {
        let task1 = school.addTask('Задание 1', 1);
        let task2 = school.addTask('Задание 2', 1);
        group.setMark(task1, 5);
        group.setMark(task2, 4);
        check(group.getMarks(), [ [task1, 5], [task2, 4] ]);
    });
    
    it('Group.list - массив студентов команды', () => {
        let student1 = school.addStudent('Виктор');
        let student2 = school.addStudent('Иван');
        group.add(student1);
        group.add(student2);
        check(group.list, [student1, student2]);
    });
    
    it ('Group.add(student) - добавляет студента в команду', () => {
        let student = school.addStudent('Виктор');
        group.add(student);
        check(group.list, [student]);
        check(student.group, group);
    });
    
    it ('Group.remove(student) - удаляет студента из команды', () => {
        let student = school.addStudent('Виктор');
        group.add(student);
        group.remove(student);
        check(group.list, []);
    });
    
});