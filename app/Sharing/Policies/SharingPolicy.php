<?php

declare(strict_types=1);

namespace App\Sharing\Policies;

use App\Actors\Contracts\Policy;
use App\Sharing\Models\Share;

/**
 * Who may share: the grants decide, so an agent may ask for a share and only the owner runs the sharing.
 */
final readonly class SharingPolicy implements Policy
{
    public static function model(): string
    {
        return Share::class;
    }
}
