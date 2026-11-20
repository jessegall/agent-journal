<?php

declare(strict_types=1);

namespace Domain\Helpers\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may dispatch helpers: the grants decide; whether the caller's policy delegates, and no more than it holds, is
 * the dispatch's own invariant, for every actor.
 */
final readonly class HelperPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
