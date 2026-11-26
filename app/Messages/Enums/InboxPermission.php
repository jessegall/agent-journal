<?php

declare(strict_types=1);

namespace App\Messages\Enums;

/**
 * What an admitted user may do with inboxes in one environment: open them, change who is in them, and be invited.
 */
enum InboxPermission: string
{
    case OpenInboxes = 'open_inboxes';
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
