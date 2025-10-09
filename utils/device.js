// utils/device.js - generate and persist device id to prevent duplicate likes per device
import { v4 as uuidv4 } from 'uuid';

export function getDeviceId() {
  if (typeof window === 'undefined') return null;
  try {
    let id = localStorage.getItem('ans_device_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('ans_device_id', id);
      document.cookie = `ans_device_id=${id};path=/;max-age=${60*60*24*365*5}`;
    }
    return id;
  } catch (e) {
    return null;
  }
}
