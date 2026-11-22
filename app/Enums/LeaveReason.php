<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Why a member's interval in a chat ended: it left, an owner removed it, it lost the right to take part, the chat
 * closed, or the agent was retired.
 */
enum LeaveReason: string
{
    case Left = 'left';
    case Removed = 'removed';
    case Revoked = 'revoked';
    case Closed = 'closed';
    case Retired = 'retired';
}
