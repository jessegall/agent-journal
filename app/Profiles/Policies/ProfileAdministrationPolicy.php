<?php

declare(strict_types=1);

namespace App\Profiles\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may administer agent profiles and the main launch: only the owner holds the ability, so the grants decide.
 */
final readonly class ProfileAdministrationPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
