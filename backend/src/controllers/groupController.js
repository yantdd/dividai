import * as groupService from '../services/groupService.js';

export async function createGroup(req, res) {
    try {
        const { name, ownerId } = req.body;
        const newGroup = await groupService.createGroupService(name, ownerId);
        return res.status(201).json(newGroup);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function getUserGroups(req, res) {
    try {
        const { userId } = req.params;
        const groups = await groupService.getGroupsByUserId(parseInt(userId));
        return res.status(200).json(groups);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function deleteGroup(req, res) {
    try {
        const { id } = req.params;
        await groupService.deleteGroupService(parseInt(id), req.userId);
        return res.status(200).json({ message: "Grupo excluído com sucesso!" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function leaveGroup(req, res) {
    try {
        const { id } = req.params;
        await groupService.leaveGroupService(parseInt(id), req.userId);
        return res.status(200).json({ message: "Você saiu do grupo!" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// ========================
// MEMBER CONTROLLERS
// ========================

export async function addMember(req, res) {
    try {
        const { groupId } = req.params;
        const { email } = req.body;
        const newMember = await groupService.addMemberByEmailService(parseInt(groupId), email, req.userId);
        return res.status(201).json(newMember);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function getMembers(req, res) {
    try {
        const { groupId } = req.params;
        const members = await groupService.getMembersService(groupId);
        return res.status(200).json(members);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function removeMember(req, res) {
    try {
        const { id } = req.params;
        await groupService.removeMemberService(parseInt(id), req.userId);
        return res.status(200).json({ message: "Membro excluído com sucesso!" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
