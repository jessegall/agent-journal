<?php

declare(strict_types=1);

namespace App\Sharing\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may share: the grants decide, so an agent may ask for a share and only the owner runs the sharing.
 */
final readonly class SharingPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
