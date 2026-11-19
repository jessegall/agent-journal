<?php

declare(strict_types=1);

namespace App\Agents\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may act on agents: the grants decide; that nobody retires itself is the retirement's own invariant.
 */
final readonly class AgentPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
