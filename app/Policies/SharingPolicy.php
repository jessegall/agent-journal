<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\OwnerPolicy;
use App\Models\Sharing\Share;

/**
 * Who may share: the grants decide, so an agent may ask for a share and only the owner runs the sharing.
 */
final readonly class SharingPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return Share::class;
    }
}
