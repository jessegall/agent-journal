<?php

declare(strict_types=1);

namespace App\Sharing\Policies;

use App\Actors\Contracts\Policy;
use App\Sharing\Models\Share;

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
