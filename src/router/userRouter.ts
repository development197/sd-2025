import { Router } from 'express'
import userController from '../controllers/userController'

const router = Router()

router.route('/register').post(userController.register)

router.route('/get-userss').get(userController.getUserAll)
router.route('/get-user/:id').get(userController.getUserID)
router.route('/get-a').get(userController.getAllAttendance)
router.route('/get-a/:userId').get(userController.getAttendanceById)
router.route('/get/:userId').get(userController.getUserById)
router.route('/update/:id').put(userController.updateUser)
router.route('/delete/:id').delete(userController.deleteUser)
// router.route('/health').get(apiController.health)

export default router
