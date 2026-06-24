import Group from '../models/Group.js';
import GroupMember from '../models/GroupMember.js';
import User from '../models/User.js';

export async function createGroupService(name, ownerId) {
    if (!name) throw new Error("O nome do grupo é obrigatório!");
    if (!ownerId) throw new Error("O ownerId é obrigatório!");

    const newGroup = await Group.create({ name, ownerId });

    const owner = await User.findByPk(ownerId);
    if (owner) {
        await GroupMember.create({
            name: owner.name,
            groupId: newGroup.id,
            userId: owner.id
        });
    }

    return newGroup;
}

export async function getGroupsByUserId(userId) {
    const memberships = await GroupMember.findAll({ where: { userId } });
    const groupIds = memberships.map(m => m.groupId);
    if (groupIds.length === 0) return [];
    const groups = await Group.findAll({ where: { id: groupIds } });
    return groups;
}

export async function deleteGroupService(groupId, requesterId) {
    const group = await Group.findByPk(groupId);
    if (!group) throw new Error("Grupo não encontrado!");
    if (group.ownerId !== requesterId) throw new Error("Apenas o criador do grupo pode deletá-lo!");

    await group.destroy();
    return true;
}

export async function leaveGroupService(groupId, userId) {
    const group = await Group.findByPk(groupId);
    if (!group) throw new Error("Grupo não encontrado!");
    if (group.ownerId === userId) throw new Error("O criador do grupo não pode sair. Delete o grupo.");

    const member = await GroupMember.findOne({ where: { groupId, userId } });
    if (!member) throw new Error("Você não é membro deste grupo!");

    await member.destroy();
    return true;
}

// ========================
// MEMBER SERVICES
// ========================

export async function addMemberByEmailService(groupId, email, requesterId) {
    if (!groupId || !email) throw new Error("groupId e email são obrigatórios!");

    const group = await Group.findByPk(groupId);
    if (!group) throw new Error("Grupo não encontrado!");
    if (group.ownerId !== requesterId) throw new Error("Apenas o criador do grupo pode adicionar membros!");

    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Usuário não cadastrado na plataforma!");

    const existing = await GroupMember.findOne({ where: { groupId, userId: user.id } });
    if (existing) throw new Error("Este usuário já é membro do grupo!");

    const newMember = await GroupMember.create({
        name: user.name,
        groupId,
        userId: user.id
    });
    return { ...newMember.toJSON(), photo: user.photo || null };
}

export async function getMembersService(groupId) {
    const members = await GroupMember.findAll({
        where: { groupId },
        include: [{ model: User, attributes: ['photo'] }]
    });
    return members.map(m => {
        const plain = m.toJSON();
        return { ...plain, photo: plain.User?.photo || null, User: undefined };
    });
}

export async function removeMemberService(memberId, requesterId) {
    const member = await GroupMember.findByPk(memberId);
    if (!member) throw new Error("Membro não encontrado!");

    const group = await Group.findByPk(member.groupId);
    if (!group) throw new Error("Grupo não encontrado!");
    if (group.ownerId !== requesterId) throw new Error("Apenas o criador do grupo pode remover membros!");

    await member.destroy();
    return true;
}
