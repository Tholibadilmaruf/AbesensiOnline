import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 50,
    duration: '30s',
};

export default function () {
    const loginRes = http.post('http://localhost:3009/auth/login', JSON.stringify({ username: 'karyawan1', password: 'workerpass' }), { headers: { 'Content-Type': 'application/json' } });
    check(loginRes, { 'login status 200': (r) => r.status === 200 });

    const token = JSON.parse(loginRes.body).token || '';
    const headers = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };

    const payload = JSON.stringify({ attendance_date: new Date().toISOString() });
    const checkin = http.post('http://localhost:3009/attendance/check-in', payload, headers);
    check(checkin, { 'checkin 201 or 200': (r) => r.status === 201 || r.status === 200 });

    sleep(1);
}
