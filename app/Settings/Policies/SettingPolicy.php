<?php

declare(strict_types=1);

namespace App\Settings\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may administer the journal settings: only the owner holds the ability, so the grants decide.
 */
final readonly class SettingPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
