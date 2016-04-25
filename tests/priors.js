describe('Тестирование приоритетов', () => {
    
    var school = new School(), student, mentor1, mentor2;
    
    beforeEach(() => {
        school = new School();
        student = school.addStudent('Иван');
        mentor1 = school.addMentor('Андрей');
        mentor2 = school.addMentor('Александр');
    })
    
    it('Person.loadPriors(priors) определяет приоритеты студента или ментора', () => {
        student.loadPriorityList([mentor2, mentor1]);
        mentor1.loadPriorityList([student]);
        mentor2.loadPriorityList([student]);
        check(student.getPrior(mentor1), 1);
        check(student.getPrior(mentor2), 0);
        check(mentor1.getPrior(student), 0);
    });
    
    it('Person.getPrior(person) возвращает номер person в приоритетном списке', () => {
        // если person нет в приоритетном списке студента или ментора, то возвращается его размер (списка)
        // то есть считается, что он на следующем месте, после последнего
        check(student.getPrior(mentor1), 0);
        student.loadPriorityList([mentor2, mentor1])
        check(student.getPrior(mentor1), 1); 
    });
    
    it('Person.getPriors() возвращает приоритезированный список ментора или студента', () => {
        check(student.getPriors(), []);
        student.loadPriorityList([mentor2, mentor1]);
        check(student.getPriors(), [mentor2, mentor1]);
    });
    
});