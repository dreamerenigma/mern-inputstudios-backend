import express from 'express';
import {
  changePassword,
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/user/:userId', getUser); 
router.get('/user/:username', getUser);
router.get('/:userId', getUser); 
router.post('/password/change', verifyToken, changePassword);

export default router;
