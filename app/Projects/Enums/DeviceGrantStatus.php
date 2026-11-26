<?php

declare(strict_types=1);

namespace App\Projects\Enums;

/**
 * Where a shell user's device grant stands: waiting for the owner, approved, handed to the shell, or revoked.
 */
enum DeviceGrantStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Issued = 'issued';
    case Revoked = 'revoked';
}
