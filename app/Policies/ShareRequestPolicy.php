<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\Policy;
use App\Models\Sharing\Share;

/**
 * Who may act on Share records; the grant decides, and the handlers keep their own checks.
 */
final readonly class ShareRequestPolicy implements Policy
{
    public static function model(): string
    {
        return Share::class;
    }
}
