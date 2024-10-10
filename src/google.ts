import { readFileSync } from "fs"
import { calendar_v3, google } from "googleapis"
import { Period } from "./untis.js"
import { Config } from "./config.js"

export const getGoogleCalendar = async (credentialPath: string, scopes: string[]) => {
    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(readFileSync(credentialPath, "utf-8")),
        scopes
    })
    
    return google.calendar({ version: "v3", auth })
}

export const addPeriodEvent = async (calendar: calendar_v3.Calendar, config: Config, period: Period) => {
    const event: calendar_v3.Schema$Event = {
        summary: `${period.nameShort} (${period.teacherShort})`,
        // location: period.roomShort,
        description: `Course: ${period.nameLong}\nTeacher: ${period.teacherLong}`,
        start: {
            dateTime: period.startISO,
            timeZone: config.time.zone
        },
        end: {
            dateTime: period.endISO,
            timeZone: config.time.zone
        },
        // status: period.status === "cancelled" ? "cancelled" : period.status === "substituted" ? "tentative" : "confirmed",
        id: period.id.toString(),
    }

    try {
        await calendar.events.get({
            calendarId: config.google.calendar,
            eventId: event.id!,
        })
        await calendar.events.update({
            calendarId: config.google.calendar,
            eventId: event.id!,
            requestBody: event
        })
    } catch (e: any) {
        if (e.code === 404) {
            try {
                await calendar.events.insert({
                    calendarId: config.google.calendar,
                    requestBody: event
                })
            } catch(e: any) {
                console.error("Error inserting event: " + e.message);
                throw e;
            }
        } else {
            console.error("Error getting or updating event: " + e.message);
            throw e;
        }
    }
}