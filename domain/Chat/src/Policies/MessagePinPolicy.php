<?php

declare(strict_types=1);

namespace Domain\Chat\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Every actor keeps its own pins; whether it may read the pinned message is checked on each pin and each list.
 */
final readonly class MessagePinPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
