<?php

declare(strict_types=1);

namespace App\Communication\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may act on a message: anyone granted may send one or ask for an answer, and only the actor the current round
 * is addressed to answers or dismisses it.
 */
final readonly class MessagePolicy implements Policy
{
    /**
     * Who may do what with a message is decided by the policy registration and by inbox membership on each path; the
     * policy adds no rule of its own.
     *
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
