<?php

declare(strict_types=1);

namespace App\Connections\Enums;

/**
 * Where a shell user's device grant stands: waiting for the owner, approved, handed to the shell, or revoked.
 */
enum DeviceGrantState: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Issued = 'issued';
    case Revoked = 'revoked';
}
