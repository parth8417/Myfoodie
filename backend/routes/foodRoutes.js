import express from 'express'
import { addFood, listFood, removeFood, updateFood } from '../controllers/foodController.js'
import { upload } from '../middlewares/multer.js'

const router = express.Router()

router.post('/add', upload.single('image'), addFood)
router.get('/list', listFood)
router.post('/remove', removeFood)
router.post('/update', updateFood)  // Changed from PUT to POST since your backend might not be configured for PUT

export default router