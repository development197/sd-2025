/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constants/responseMessage'
import httpError from '../util/httpError'
import db from '../config/mysqlConnection'
import moment from 'moment-timezone'

export default {
    getAllUsers: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [rows] = await db.query(`
                SELECT 
  u.id AS user_id,
  u.name AS user_name,
  u.email,
  u.mobile,
  u.image AS user_image,  
  u.status AS user_status,

  ed.id AS employee_detail_id,
  ed.company_id,
  ed.employee_id AS employee_code,
  ed.address,
  ed.hourly_rate,
  ed.designation_id,
  dsg.name AS designation_name,
  t.team_name AS department_name,   
  ed.joining_date,
  ed.last_date,
  ed.added_by,
  ed.last_updated_by,
  ed.attendance_reminder,
  ed.date_of_birth,
  ed.calendar_view,
  ed.about_me,
  ed.reporting_to,
  ed.contract_end_date,
  ed.internship_end_date,
  ed.employment_type,
  ed.marriage_anniversary_date,
  ed.marital_status,
  ed.notice_period_end_date,
  ed.notice_period_start_date,
  ed.probation_end_date,
  ed.created_at,
  ed.updated_at,
  ed.company_address_id,

  MIN(r.name) AS role_name  -- Select one role name (alphabetically)

FROM 
  users u
LEFT JOIN 
  employee_details ed ON ed.user_id = u.id
LEFT JOIN 
  designations dsg ON ed.designation_id = dsg.id
LEFT JOIN 
  role_user ru ON u.id = ru.user_id
LEFT JOIN 
  roles r ON ru.role_id = r.id
LEFT JOIN 
  teams t ON ed.department_id = t.id 

GROUP BY 
  u.id `)
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getUser: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const userId = req.params.id

        if (!userId) {
            return httpResponse(req, res, 400, responseMessage.SOMETHING_WENT_WRONG, { error: 'User ID is required' })
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
            const [rows]: any[] = await db.query(
                `
                SELECT
                    ed.id AS employee_detail_id,
                    ed.company_id,
                    ed.user_id,
                    u.name AS user_name,
                    u.email,
                    u.mobile,
                    u.image AS user_image,
                    u.status AS user_status,
                    ed.employee_id AS employee_code,
                    ed.address,
                    ed.hourly_rate,
                    ed.designation_id,
                    dsg.name AS designation_name,
                    t.team_name AS department_name, 
                    r.name AS role_name,
                    ed.joining_date,
                    ed.last_date,
                    ed.added_by,
                    ed.last_updated_by,
                    ed.attendance_reminder,
                    ed.date_of_birth,
                    ed.calendar_view,
                    ed.about_me,
                    ed.reporting_to,
                    ed.contract_end_date,
                    ed.internship_end_date,
                    ed.employment_type,
                    ed.marriage_anniversary_date,
                    ed.marital_status,
                    ed.notice_period_end_date,
                    ed.notice_period_start_date,
                    ed.probation_end_date,
                    ed.created_at,
                    ed.updated_at,
                    ed.company_address_id
                FROM
                    employee_details ed
                LEFT JOIN
                    users u ON ed.user_id = u.id
                LEFT JOIN
                    designations dsg ON ed.designation_id = dsg.id
                LEFT JOIN
                    role_user ru ON ed.user_id = ru.user_id
                LEFT JOIN
                    roles r ON ru.role_id = r.id
                LEFT JOIN 
                    teams t ON ed.department_id = t.id
                WHERE ed.user_id = ?
                GROUP BY
                    ed.id, ed.company_id, ed.user_id, u.name, u.email, u.mobile, u.image, u.status, ed.employee_id,
                    ed.address, ed.hourly_rate, ed.slack_username, ed.designation_id, dsg.name, t.team_name, ed.joining_date,
                    ed.last_date, ed.added_by, ed.last_updated_by, ed.attendance_reminder, ed.date_of_birth,
                    ed.calendar_view, ed.about_me, ed.reporting_to, ed.contract_end_date, ed.internship_end_date,
                    ed.employment_type, ed.marriage_anniversary_date, ed.marital_status, ed.notice_period_end_date,
                    ed.notice_period_start_date, ed.probation_end_date, ed.created_at, ed.updated_at, ed.company_address_id
            `,
                [userId]
            )
            if (rows.length === 0) {
                return httpResponse(req, res, 404, responseMessage.SOMETHING_WENT_WRONG, { error: 'User not found' })
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, rows[0])
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getDesignations: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
            const [rows]: any[] = await db.query(
                `
                SELECT
                    id,
                    name
                FROM
                    designations
            `
            )

            if (rows.length === 0) {
                return httpResponse(req, res, 404, responseMessage.SOMETHING_WENT_WRONG, { error: 'No designations found' })
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getDesignationById: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const designationId = req.params.id

        if (!designationId) {
            return httpResponse(req, res, 400, responseMessage.SOMETHING_WENT_WRONG, { error: 'Designation ID is required' })
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
            const [rows]: any[] = await db.query(
                `
                SELECT
                    id,
                    name
                FROM
                    designations
                WHERE
                    id = ?
                `,
                [designationId]
            )

            if (rows.length === 0) {
                return httpResponse(req, res, 404, responseMessage.SOMETHING_WENT_WRONG, { error: 'Designation not found' })
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, rows[0])
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getDepartment: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
            const [rows]: any[] = await db.query(
                `
                SELECT
                    id,
                    team_name
                FROM
                    teams
            `
            )

            if (rows.length === 0) {
                return httpResponse(req, res, 404, responseMessage.SOMETHING_WENT_WRONG, { error: 'No designations found' })
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getDepartmentById: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const departmentId = req.params.id

        if (!departmentId) {
            return httpResponse(req, res, 400, responseMessage.SOMETHING_WENT_WRONG, { error: 'Department ID is required' })
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
            const [rows]: any[] = await db.query(
                `
                SELECT
                    id,
                    team_name
                FROM
                    teams
                WHERE
                    id = ?
                `,
                [departmentId]
            )

            if (rows.length === 0) {
                return httpResponse(req, res, 404, responseMessage.SOMETHING_WENT_WRONG, { error: 'Department not found' })
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, rows[0])
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getAllAttendance: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [rows] = await db.query(`
                SELECT
        a.id,
        a.company_id,
        a.user_id,
        u.name AS user_name,
        u.image AS user_image,
        a.location_id,
        a.clock_in_time,
        a.clock_out_time,
        a.clock_in_type,
        a.clock_out_type,
        a.auto_clock_out,
        a.clock_in_ip,
        a.clock_out_ip,
        a.working_from,
        a.late,
        a.half_day,
        a.half_day_type,
        a.added_by,
        a.last_updated_by,
        a.latitude,
        a.longitude,
        a.shift_start_time,
        a.shift_end_time,
        a.employee_shift_id,
        a.created_at,
        a.updated_at,
        a.work_from_type,
        a.overwrite_attendance,

        -- Office Shift
        es.shift_name,
        es.office_start_time,
        es.office_end_time,
        es.office_open_days,

        -- Employee schedule
        ess.date AS scheduled_date,
        ess.employee_shift_id AS scheduled_shift_id,

        -- Leave info
        l.id AS leave_id,
        l.leave_type_id,
        l.duration AS leave_duration,
        l.leave_date,
        l.reason AS leave_reason,
        l.status AS leave_status,
        l.reject_reason,
        l.paid,
        l.added_by AS leave_added_by,
        l.last_updated_by AS leave_updated_by,
        l.event_id,
        l.approved_by,
        l.approved_at,
        l.half_day_type AS leave_half_day_type,
        l.manager_status_permission,
        l.approve_reason,
        l.over_utilized,

        -- Holiday
        h.id AS holiday_id,
        h.date AS holiday_date,
        h.occassion AS holiday_reason,

        -- Weekday (0 = Sunday, 6 = Saturday)
        DAYOFWEEK(a.clock_in_time) - 1 AS weekday_num

    FROM attendances a

    LEFT JOIN users u
        ON a.user_id = u.id

    LEFT JOIN employee_shift_schedules ess
        ON a.user_id = ess.user_id
        AND DATE(a.clock_in_time) = ess.date

    LEFT JOIN employee_shifts es
        ON ess.employee_shift_id = es.id

    LEFT JOIN leaves l
        ON l.user_id = a.user_id
       AND l.leave_date = DATE(a.clock_in_time)

    LEFT JOIN holidays h
        ON h.company_id = a.company_id
       AND h.date = DATE(a.clock_in_time)

    WHERE a.company_id = 1
      AND DATE(a.clock_in_time) BETWEEN '2025-04-01' AND '2025-04-30'
      AND JSON_CONTAINS(es.office_open_days, JSON_QUOTE(CAST(DAYOFWEEK(a.clock_in_time) - 1 AS CHAR))) = 1;
            `)

            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getAttendanceById: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const { userId } = req.params

            const [results]: any = await db.query(
                `
                SELECT * FROM attendances WHERE user_id = ?
                
                `,
                [userId]
            )
            if (results.length === 0) {
                return httpResponse(req, res, 404, 'User not found.')
            }
            httpResponse(req, res, 200, 'User found', { user: results })
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    clockIn: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { user_id, company_id } = req.body

        if (!user_id) {
            return httpResponse(req, res, 400, responseMessage.SOMETHING_WENT_WRONG, { error: 'User ID is required' })
        }

        try {
            // Get the current time in Indian Standard Time (IST)
            const clockInTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')

            // Fetch the shift details from employee_shift_schedules for the user on today's date
            const [shiftDetails]: any[] = await db.query(
                `SELECT ess.id, ess.shift_start_time, ess.shift_end_time, ess.employee_shift_id
                 FROM employee_shift_schedules ess
                 WHERE ess.user_id = ? AND ess.date = CURDATE()`,
                [user_id]
            )

            if (shiftDetails.length === 0) {
                return httpResponse(req, res, 404, responseMessage.SOMETHING_WENT_WRONG, { error: 'No shift details found for today' })
            }

            const shift = shiftDetails[0] // Assuming the first entry is the correct one

            // Insert clock-in record into attendances table
            const [result]: any = await db.query(
                `INSERT INTO attendances 
                 (company_id, user_id, clock_in_time, clock_in_type, clock_in_ip, latitude, longitude, shift_start_time, shift_end_time, employee_shift_id, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    company_id, // Company ID
                    user_id, // User ID
                    clockInTime, // clock-in time as the current time in IST
                    'Manual', // clock-in type: manual
                    req.ip, // Assuming clock-in IP is fetched from request
                    0, // Latitude placeholder (can be fetched if available)
                    0, // Longitude placeholder (can be fetched if available)
                    shift.shift_start_time, // Shift start time from schedule
                    shift.shift_end_time, // Shift end time from schedule
                    shift.employee_shift_id, // Employee shift ID from schedule
                    clockInTime, // created_at
                    clockInTime // updated_at
                ]
            )

            if (result.affectedRows === 0) {
                return httpResponse(req, res, 500, responseMessage.SOMETHING_WENT_WRONG, { error: 'Clock-In failed' })
            }

            // Return success response
            httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Clocked in successfully' })
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    clockOut: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { id } = req.body

        if (!id) {
            return httpResponse(req, res, 400, responseMessage.SOMETHING_WENT_WRONG, { error: 'Attendance ID is required' })
        }

        try {
            // Get the current time in Indian Standard Time (IST)
            const clockOutTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
            const clockOutIp = req.ip // Get the IP address of the user for clocking out

            // Fetch the attendance record for the given attendance_id where clock_out_time is NULL
            const [attendanceRecord]: any[] = await db.query(
                `SELECT id, clock_in_time, clock_out_time 
             FROM attendances
             WHERE id = ? AND clock_out_time IS NULL`,
                [id]
            )

            if (attendanceRecord.length === 0) {
                return httpResponse(req, res, 404, responseMessage.SOMETHING_WENT_WRONG, {
                    error: 'No active clock-in record found for the given attendance ID'
                })
            }

            const attendance = attendanceRecord[0]

            // Update the clock-out time and clock-out IP in the attendances table
            const [result]: any = await db.query(
                `UPDATE attendances 
             SET clock_out_time = ?, clock_out_ip = ?, updated_at = ? 
             WHERE id = ?`,
                [
                    clockOutTime, // clock-out time as the current time in IST
                    clockOutIp, // clock-out IP address
                    clockOutTime, // updated_at timestamp
                    attendance.id // Attendance record ID to update
                ]
            )

            if (result.affectedRows === 0) {
                return httpResponse(req, res, 500, responseMessage.SOMETHING_WENT_WRONG, { error: 'Clock-Out failed' })
            }

            // Return success response
            httpResponse(req, res, 200, responseMessage.SUCCESS, { message: 'Clocked out successfully' })
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getTableSingleAttendance: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { id, user_id } = req.params

        if (!id || !user_id) {
            return httpResponse(req, res, 400, responseMessage.SOMETHING_WENT_WRONG, { error: 'Attendance ID and User ID are required' })
        }

        try {
            const [rows]: any[] = await db.query(
                `
    SELECT a.*, u.name, u.image
    FROM attendances AS a
    JOIN users AS u ON a.user_id = u.id
    WHERE a.id = ?
      AND a.user_id = ?
    LIMIT 0, 25;
    `,
                [id, user_id]
            )

            if (rows.length === 0) {
                return httpResponse(req, res, 404, responseMessage.SOMETHING_WENT_WRONG, { error: 'Attendance record not found' })
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, rows[0])
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    }
}

// SELECT a.*, u.name, u.image
// FROM attendances AS a
// JOIN users AS u ON a.user_id = u.id
// WHERE a.user_id = 1
//   AND a.clock_in_time = '2025-04-15 08:59:00'
// LIMIT 0, 25;
