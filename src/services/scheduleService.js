import { db } from '../db.js';
import { sendPlayCommand } from '../controllers/streamController.js';
import { DateTime } from 'luxon';
import { ResponseError, ResponseSuccess } from '../lib/response.js';

// Helper: get current day/hour/minute in Jakarta time
function getJakartaTime() {
  const nowJakarta = DateTime.now().setZone('Asia/Jakarta');
  return {
    hour: nowJakarta.hour,
    minute: nowJakarta.minute,
    day: nowJakarta.weekday % 7 // 0=Sunday
  };
}

// Main scheduler function
export const startSoundScheduler = () => {
  setInterval(async () => {
    const { hour, minute, day } = getJakartaTime();
    // Find all schedules for this hour/minute
    const schedules = await db.soundSchedule.findMany({
      where: {
        hour,
        minute,
      },
      include: { sound: true },
    });
    for (const sched of schedules) {
      // If days is empty (every day), or today is in days
      if (sched.days === 'all') {
        if (sched.sound) {
          sendPlayCommand({
            type: 'schedule',
            action: 'play',
            stream: sched.sound.fileUrl,
          });
        }
      } else {
        const daysArr = sched.days.split(',').map(Number);
        if (daysArr.includes(day)) {
          if (sched.sound) {
            sendPlayCommand({
              type: 'schedule',
              action: 'play',
              stream: sched.sound.fileUrl,
            });
          }
        }
      }
    }
  }, 30 * 1000); // every 30 seconds
}

export const createScheduleService = async (id, { days, hour, minute = 0 }) => {
  const sound = await db.sound.findUnique({
    where:{
      id
    }
  })
  if (!sound) {
    throw ResponseError.notFound('sound not found')
    
  }
  let daysStr = (!days || days.length === 0) ? 'all' : days.join(',');
  await db.soundSchedule.create({
    data: { soundId: id, days: daysStr, hour, minute }
  });
  return ResponseSuccess.created()
}

export const getAllSchedulesService = async () => {
  const schedules =  await db.soundSchedule.findMany({ include: { sound: true } });
  return ResponseSuccess.success(schedules)
}

export const deleteScheduleService = async (id) => {
  await db.soundSchedule.delete({ where: { id } });
  return { success: true };
}
