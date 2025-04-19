/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constants/responseMessage'
import httpError from '../util/httpError'
// import { User } from '../types/types'
import db from '../config/mysqlConnection'
import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt';
// import bcrypt from 'bcryptjs'

// export default {
//     register: async(req: Request, res: Response, nextFunc: NextFunction) => {

//         // eslint-disable-next-line no-console
//         console.log(req.body);

//         const {name, email, password, role} = req.body;

//         try {

//             // eslint-disable-next-line no-console
//             console.log(name, email);

//             // if (!name || !email || password) {
//             //     return httpResponse(req, res, 400, 'All fields are required.')
//             // }

//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             const [result]: any = await db.query('SELECT * FROM users WHERE email = ?', [email])
//             if (result.length > 0) {
//                 return httpError(nextFunc, new Error('Email already exist'), req, 404)
//             }

//                 // Hash the password
//                 const saltRounds = 10;
//                 // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//                 const hashedPassword = await bcrypt.hash(password, saltRounds);

//                 await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',[name, email, hashedPassword, role])

//             httpResponse(req, res, 200, responseMessage.SUCCESS)
//         } catch (err) {
//             httpError(nextFunc, err, req, 500)
//         }
//     },

// }

export default {
    // Create User (Register)
    register: async (req: Request, res: Response, nextFunc: NextFunction) => {},

    // Update User
    updateUser: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { id } = req.params
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { name, email, password, role } = req.body

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [existingUser]: any = await db.query('SELECT * FROM users WHERE id = ?', [id])
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (existingUser.length === 0) {
                return httpError(nextFunc, new Error('User not found'), req, 404)
            }

            // const saltRounds = 10;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            // const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : existingUser[0].password;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            await db.query('UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?', [
                name || existingUser[0].name,
                email || existingUser[0].email,
                password,
                role || existingUser[0].role,
                id
            ])

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    // Delete User
    deleteUser: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { id } = req.params

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [existingUser]: any = await db.query('SELECT * FROM users WHERE id = ?', [id])
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (existingUser.length === 0) {
                return httpError(nextFunc, new Error('User not found'), req, 404)
            }

            await db.query('DELETE FROM users WHERE id = ?', [id])

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getUserById: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const { userId } = req.params

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [results]: any = await db.query('SELECT * FROM users WHERE id = ?', [userId])

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (results.length === 0) {
                return httpResponse(req, res, 404, 'User not found.')
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            httpResponse(req, res, 200, 'User found', { company: results[0] })
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getAttendanceById: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const { userId } = req.params

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    getAllAttendance: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [rows] = await db.query(`

                SELECT 
    a.id,
    a.company_id,
    a.user_id,
    u.name AS user_name,
    u.image AS user_image,  -- ⬅️ Add user image here
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

    -- Office open days
    es.office_open_days,

    -- Leave details
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
    l.over_utilized

FROM attendances a

LEFT JOIN users u 
    ON a.user_id = u.id

LEFT JOIN employee_shifts es 
    ON a.employee_shift_id = es.id

LEFT JOIN leaves l 
    ON l.user_id = a.user_id 
   AND l.leave_date = DATE(a.clock_in_time)

WHERE a.company_id = 1
  AND DATE(a.clock_in_time) BETWEEN '2025-04-01' AND '2025-04-30';
                
                `)
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getUserID: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const userId = req.params.id

        if (!userId) {
            return httpResponse(req, res, 400, responseMessage.SOMETHING_WENT_WRONG, { error: 'User ID is required' })
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            WHERE ed.user_id = ?
            GROUP BY 
                ed.id, ed.company_id, ed.user_id, u.name, u.email, u.mobile, u.image, u.status, ed.employee_id, 
                ed.address, ed.hourly_rate, ed.slack_username, ed.designation_id, dsg.name, ed.joining_date, 
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

    getUserAll: async (req: Request, res: Response, nextFunc: NextFunction) => {
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
  u.id


                
                `)
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    login: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [result]: any = await db.query('SELECT * FROM users WHERE email = ?', [email])

            if (!result.user) {
                return res.status(404).json({ error: 'User not found' })
                // httpError(nextFunc, error, req, 400)
            }

            // Compare password directly (no hashing)
            if (result.password !== password) {
                return res.status(401).json({ error: 'Invalid credentials' })
            }

            // Generate JWT token
            const token = jwt.sign({ userId: result.id, role: result.role }, '1234456', { expiresIn: '1h' })

            // Respond with user data and token
            res.json({
                user: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    role: result.role
                },
                token
            })
        } catch (error) {
            // res.status(500).json({ error: error })
            httpError(nextFunc, error, req, 500)
        }
    }
}
