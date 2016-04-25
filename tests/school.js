describe('Тестирование класса School', () => {
    var school;
    
    beforeEach(function() {
        school = new School();
    });
    
    it('Constructor', () => {
        // создание школы, проверка, не возникает ли ошибок
        let school = new School(); 
    });
    
    it('School.addStudent(name) - создает и возвращает студента', () => {
        let student = school.addStudent('Виктор');
        // Проверка имени студента
        check(student.name, 'Виктор');
        // Проверка id студента
        check(student.id, 0);
    });
    
    it('School.addGroup(name) - создает и возвращает группу', () => {
        let group = school.addGroup('Группа 1');
        check(group.name, 'Группа 1');
    });
    
    it('School.addTask(name, type) - создает и возвращает группу', () => {
        let task = school.addTask('Задание 1');
        check(task.name, 'Задание 1');
    });
    
    it('School.addMentor(name) - создает и возвращает ментора', () => {
        let mentor = school.addMentor('Иван');
        check(mentor.name, 'Иван');
    });
    
    it('School.students - массив студентов школы', () => {
        // изначально пустой
        check(school.students, []);
        let student1 = school.addStudent('Иван');
        let student2 = school.addStudent('Михаил');
        check(school.students, [student1, student2]);
    });
});