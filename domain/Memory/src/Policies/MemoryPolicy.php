<?php

declare(strict_types=1);

namespace Domain\Memory\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may work with memories: every granted actor, so the grants decide.
 */
final readonly class MemoryPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
