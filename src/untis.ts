import { Klasse, Lesson, SchoolYear, ShortData, WebUntis, WebUntisAnonymousAuth, WebUntisElementType } from "webuntis"
import { Config } from "./config.js";


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

export const getPeriods = async (untis: WebUntis, config: Config, course: Klasse, start: Date, end: Date): Promise<Period[]> => {
    const lessons = await untis.getTimetableForRange(start, end, course.id, WebUntisElementType.CLASS);
    return Promise.all(lessons.map(l => getPeriod(l, config)));
}

export const getISOTime = (value: number): string => {
    const padded = value.toString().padStart(4, "0");
    return `${padded.slice(0, 2)}:${padded.slice(2, 4)}:00`;
}

export const getISODateTime = (dateRaw: number, timeRaw: number): string => {
    const date = dateRaw.toString();
    const isoTime = getISOTime(timeRaw);
    const isoDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
    return `${isoDate}T${isoTime}`
}

export const getISODateTimeOffset = (date: number, time: number, offset: string): string => {
    return `${getISODateTime(date, time)}${offset}`
}

export type Status =  "irregular" | "cancelled" | "substituted";
export type Period = {
    startISO: string,
    endISO: string,
    nameShort: string,
    nameLong: string,
    teacherLong: string,
    teacherShort: string,
    orgTeacher?: string,
    roomLong: string,
    roomShort: string,
    orgRoom?: string,
    info?: string,
    id: number,
    status?: Status
}

export const getPeriod = async (lesson: Lesson, config: Config): Promise<Period> => {
    const offset = config.time.offset;
    const startISO = getISODateTimeOffset(lesson.date, lesson.startTime, offset);
    const endISO = getISODateTimeOffset(lesson.date, lesson.endTime, offset);

    let status: Status | undefined = undefined
    if (lesson.code == "irregular") {
        status = "irregular"
    } else if (lesson.code == "cancelled" || lesson.ro[0].name == "Home") {
        status = "cancelled"
    } else if (lesson.te[0].orgname) {
        status = "substituted"
    }

    return {
        startISO, endISO,
        nameShort: lesson.su[0].name,
        nameLong: lesson.su[0].longname,
        roomLong: lesson.ro[0].longname,
        roomShort: lesson.ro[0].name,
        orgRoom: lesson.ro[0].orgname,
        teacherLong: lesson.te[0].longname,
        teacherShort: lesson.te[0].name,
        orgTeacher: lesson.te[0].orgname,
        info: lesson.info,
        id: lesson.id,
        status
    }
}