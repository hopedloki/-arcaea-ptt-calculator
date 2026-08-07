import { request } from './request'
import { API } from '../constants/api'

export async function fetchCloudRecords(userId: number): Promise<any[]> {
  const records = await request(`${API.CLOUD.RECORDS}?userId=${userId}`, 'GET')
  return records.map((r: any) => ({
    ...r,
    constant: r.constantVal,
    timestamp: r.recordTime
  }))
}

export async function uploadCloudRecords(
  userId: number,
  records: any[],
  currentPtt: number
): Promise<void> {
  const recordsToUpload = records.map((r: any) => ({
    ...r,
    constant: r.constant || r.constantVal,
    recordTime: r.recordTime || r.timestamp
  }))
  await request(API.CLOUD.UPLOAD, 'POST', {
    userId,
    records: recordsToUpload,
    currentPtt
  })
}
