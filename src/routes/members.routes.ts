import { Router } from 'express';
import { getAllMembers, getMemberById, createMember, updateMemberStatus, deleteMember } from '../controllers/members.controller';

const router = Router();

router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', createMember);
router.patch('/:id/status', updateMemberStatus);
router.delete('/:id', deleteMember);

export default router;
