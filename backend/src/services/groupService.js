import Group from '../models/Group.js';
import GroupMember from '../models/GroupMember.js';
import User from '../models/User.js';

export async function createGroupService(name, ownerId) {
    if (!name) throw new Error("O nome do grupo é obrigatório!");
    if (!ownerId) throw new Error("O ownerId é obrigatório!");

    const newGroup = await Group.create({ name, ownerId });
    
    // Adiciona o dono como primeiro membro
    const owner = await User.findByPk(ownerId);
    if (owner) {
        await GroupMember.create({
            name: `${owner.name} (Você)`,
            groupId: newGroup.id,
            userId: owner.id
        });
    }

    return newGroup;
}

export async function getGroupsByUserId(userId) {
    const groups = await Group.findAll({ where: { ownerId: userId } });
    return groups;
}

export async function deleteGroupService(groupId) {
    const group = await Group.findByPk(groupId);
    if (!group) throw new Error("Grupo não encontrado!");

    await group.destroy();
    return true;
}

// ========================
// MEMBER SERVICES
// ========================

export async function addMemberService(groupId, name, userId = null) {
    if (!groupId || !name) throw new Error("groupId e name são obrigatórios!");
    
    const newMember = await GroupMember.create({ name, groupId, userId });
    return newMember;
}

export async function getMembersService(groupId) {
    const members = await GroupMember.findAll({ where: { groupId } });
    return members;
}

export async function removeMemberService(memberId) {
    const member = await GroupMember.findByPk(memberId);
    if (!member) throw new Error("Membro não encontrado!");

    await member.destroy();
    return true;
}
