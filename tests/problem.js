describe('Тестирование распределения', () => {
    
    beforeEach(() => {
        school = new School();
        student1 = school.addStudent('Студент 1');
        student2 = school.addStudent('Студент 2');
        student3 = school.addStudent('Студент 3');
        student4 = school.addStudent('Студент 4');
        mentor1 = school.addMentor('Ментор 1');
        mentor2 = school.addMentor('Ментор 3');
        mentor3 = school.addMentor('Ментор 4');
        mentor4 = school.addMentor('Ментор 5');
    });
    
    it('Тест 1, простой тест', () => {
        student1.loadPriorityList([mentor1]);
        mentor1.loadPriorityList([student1]);
        school.dispence();
        check(student1.mentor.id, mentor1.id);
    })
    
    it('Тест 2, существует идеальное решение', () => {
        student1.loadPriorityList([mentor4, mentor1, mentor3, mentor2]);
        student2.loadPriorityList([mentor3, mentor1, mentor2, mentor4]);
        student3.loadPriorityList([mentor2, mentor1, mentor3, mentor4]);
        student4.loadPriorityList([mentor1, mentor4, mentor3, mentor2]);
        mentor1.loadPriorityList([student4]);
        mentor2.loadPriorityList([student3]);
        mentor3.loadPriorityList([student2]);
        mentor4.loadPriorityList([student1]);
        school.dispence();
        check(student1.mentor.id, mentor4.id);
        check(student2.mentor.id, mentor3.id);
        check(student3.mentor.id, mentor2.id);
        check(student4.mentor.id, mentor1.id);
    });
    
    it('Тест 3, другое распределение', () => {
        student1.loadPriorityList([mentor4, mentor1, mentor3, mentor2]);
        student2.loadPriorityList([mentor1, mentor3, mentor2, mentor4]);
        student3.loadPriorityList([mentor2, mentor1, mentor3, mentor4]);
        student4.loadPriorityList([mentor1, mentor4, mentor3, mentor2]);
        mentor1.loadPriorityList([student4]);
        mentor2.loadPriorityList([student3]);
        mentor3.loadPriorityList([student2]);
        mentor4.loadPriorityList([student1]);
        school.dispence();
        check(student1.mentor.id, mentor4.id);
        check(student2.mentor.id, mentor3.id);
        check(student3.mentor.id, mentor2.id);
        check(student4.mentor.id, mentor1.id);
    });
    
});