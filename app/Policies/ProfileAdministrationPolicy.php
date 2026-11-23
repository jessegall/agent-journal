<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\OwnerPolicy;
use App\Models\Profiles\Profile;

/**
 * Who may administer agent profiles and the main start: only the owner holds the access, so the grants decide.
 */
final readonly class ProfileAdministrationPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return Profile::class;
    }
}
