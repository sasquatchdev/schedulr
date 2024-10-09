import { Klasse, SchoolYear, WebUntis, WebUntisAnonymousAuth } from "webuntis"


export const getWebUntisSimple = async (
    school: string, baseurl: string
): Promise<WebUntis> => {
    const untis = new WebUntisAnonymousAuth(school, baseurl);
    await untis.login();
    return untis;
}

export const getSchoolyear = async (untis: WebUntis, name: string): Promise<SchoolYear> => {
    const years = await untis.getSchoolyears();
    const year = years.find(y => y.name == name) || await untis.getCurrentSchoolyear();
    return year;
}

export const getCourse = async (untis: WebUntis, schoolyear: SchoolYear, name: string): Promise<Klasse> => {
    const courses = await untis.getClasses(undefined, schoolyear.id);
    const course = courses.find(c => c.name == name)!;
    return course;
}