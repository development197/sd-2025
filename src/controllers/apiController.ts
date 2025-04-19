import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constants/responseMessage'
import httpError from '../util/httpError'
import quicker from '../util/quicker'
import db from '../config/mysqlConnection'

export default {
    self: async (req: Request, res: Response, nextFunc: NextFunction) => {
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
    health: (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const healthData = {
                application: quicker.getApplicationHealth(),
                system: quicker.getSystemHealth(),
                timestamp: Date.now()
            }
            httpResponse(req, res, 200, responseMessage.SUCCESS, healthData)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    }
}
