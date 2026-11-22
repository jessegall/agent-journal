<?php

declare(strict_types=1);

namespace App\Actors\Enums;

/**
 * What an admitted user may do with chats in one environment: open them, change who is in them, and be invited.
 */
enum ChatPermission: string
{
    case CreateChats = 'create_chats';
    case ManageMembers = 'manage_members';
    case ReceiveInvitations = 'receive_invitations';

    /**
     * The grant column that holds this permission.
     */
    public function column(): string
    {
        return "can_{$this->value}";
    }
}
