<?php

declare(strict_types=1);

namespace App\Supervision\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

final readonly class AskPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
