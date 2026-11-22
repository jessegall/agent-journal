<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * Why a member's interval in a chat ended: it left, an owner removed it, it lost the right to take part, or the chat
 * closed.
 */
enum LeaveReason: string
{
    case Left = 'left';
    case Removed = 'removed';
    case Revoked = 'revoked';
    case Closed = 'closed';
}
