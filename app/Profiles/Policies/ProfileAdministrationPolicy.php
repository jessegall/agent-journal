<?php

declare(strict_types=1);

namespace App\Profiles\Policies;

use App\Actors\Contracts\Policy;
use App\Profiles\Models\Profile;

/**
 * Who may administer agent profiles and the main start: only the owner holds the access, so the grants decide.
 */
final readonly class ProfileAdministrationPolicy implements Policy
{
    public static function model(): string
    {
        return Profile::class;
    }
}
