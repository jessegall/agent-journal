<?php

declare(strict_types=1);

namespace App\Communication\Policies;

use App\Actors\Contracts\Policy;
use App\Communication\Models\Message;

/**
 * Who may act on a message: anyone granted may send one or ask for an answer, and only the actor the current round
 * is addressed to answers or dismisses it.
 */
final readonly class MessagePolicy implements Policy
{
    public static function model(): string
    {
        return Message::class;
    }
}
