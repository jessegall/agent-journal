<?php

declare(strict_types=1);

namespace App\Profiles\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may read and manage the saved accounts: only the owner holds the abilities, so the grants decide.
 */
final readonly class AccountPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
