<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\OwnerPolicy;
use App\Models\Messages\Message;

/**
 * Who may act on Message records; the grant decides, and the handlers keep their own checks.
 */
final readonly class MessageAdministrationPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return Message::class;
    }
}
