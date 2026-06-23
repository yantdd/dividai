import express from 'express';
import * as groupController from '../controllers/groupController.js';

const router = express.Router();

router.post('/', groupController.createGroup);
router.get('/user/:userId', groupController.getUserGroups);
router.delete('/:id', groupController.deleteGroup);

// Member routes
router.post('/:groupId/members', groupController.addMember);
router.get('/:groupId/members', groupController.getMembers);
router.delete('/members/:id', groupController.removeMember);

export default router;
