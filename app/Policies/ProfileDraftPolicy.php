<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\Policy;
use App\Models\Profiles\Profile;

/**
 * Who may act on Profile records; the grant decides, and the handlers keep their own checks.
 */
final readonly class ProfileDraftPolicy implements Policy
{
    public static function model(): string
    {
        return Profile::class;
    }
}
