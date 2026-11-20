<?php

declare(strict_types=1);

namespace App\Communication\Policies;

use App\Actors\Contracts\Policy;
use App\Communication\Models\Message;

/**
 * Who may act on Message records; the grant decides, and the handlers keep their own checks.
 */
final readonly class MessageAdministrationPolicy implements Policy
{
    public static function model(): string
    {
        return Message::class;
    }
}
