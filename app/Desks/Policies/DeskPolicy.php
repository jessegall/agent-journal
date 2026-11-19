<?php

declare(strict_types=1);

namespace App\Desks\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Desks are arranged by the actors the registration lets arrange them; the policy adds no rule of its own.
 */
final readonly class DeskPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
