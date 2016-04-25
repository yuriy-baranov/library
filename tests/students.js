describe('Тестирование класса Student', () => {
    var school, student, task;
    
     beforeEach(function() {
        school = new School();
        student = school.addStudent('Виктор');
        task = school.addTask('Задание 1', 0);
    });
    
    it('Student.name - имя студента', () => {
        let student = school.addStudent('Михаил');
        check(student.name, 'Михаил');
    });
    
    it('Student.id - возвращает id студента', () => {
        let student = school.addStudent('Иван');
        // id так же является порядковым номером в массиве студентов школы
        check(school.students[student.id], student);
    });
    
    it('Student.setMark(task, mark) - выставляет студенту оценку за задание', () => {
        let task = school.addTask('Задание 1', 0);
        student.setMark(task, 5);
        check(student.getMarks(), [[task, 5]]);
    });
    
    it('Student.getMark(task) - возвращает оценку за задание у студенту, или null, если она не выставлена', () => {
        check(student.getMark(task), null);
        student.setMark(task, 4);
        check(student.getMark(task), 4);
    });
    
    it('Student.getMarks() - возвращает список оценок', () => {
        let task1 = school.addTask('Задание 1', 0);
        let task2 = school.addTask('Задание 2', 0);
        student.setMark(task1, 5);
        student.setMark(task2, 4);
        check(student.getMarks(), [ [task1, 5], [task2, 4] ]);
    });
    
    
});