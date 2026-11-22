<?php

declare(strict_types=1);

namespace Domain\Chat\Policies;

use App\Contracts\Policy;
use Domain\Chat\Models\MessagePin;

/**
 * Every actor keeps its own pins; whether it may read the pinned message is checked on each pin and each list.
 */
final readonly class MessagePinPolicy implements Policy
{
    public static function model(): string
    {
        return MessagePin::class;
    }
}
