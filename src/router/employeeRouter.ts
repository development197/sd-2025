import { Router } from 'express'
import employeeController from '../controllers/employeeController'

const router = Router()

router.route('/get').get(employeeController.getAllUsers)
router.route('/get/:id').get(employeeController.getUser)
// -----------------------------------------------------
router.route('/get-designation').get(employeeController.getDesignations)
router.route('/get-department').get(employeeController.getDepartment)
router.route('/get-designation/:id').get(employeeController.getDesignationById)
router.route('/get-department/:id').get(employeeController.getDepartmentById)

router.route('/get-attendance').get(employeeController.getAllAttendance)
router.route('/get-attendance/:userId').get(employeeController.getAttendanceById)
router.route('/clock-in').post(employeeController.clockIn)
router.route('/clock-out').put(employeeController.clockOut)

router.route('/get-table-attendance-single/:id/:user_id').get(employeeController.getTableSingleAttendance)

// router.route('/get-userss').get(userController.getUserAll)
// router.route('/get-user/:id').get(userController.getUserID)
// router.route('/get-a').get(userController.getAllAttendance)
// router.route('/get-a/:userId').get(userController.getAttendanceById)
// router.route('/get/:userId').get(userController.getUserById)
// router.route('/update/:id').put(userController.updateUser)
// router.route('/delete/:id').delete(userController.deleteUser)
// router.route('/health').get(apiController.health)

export default router
