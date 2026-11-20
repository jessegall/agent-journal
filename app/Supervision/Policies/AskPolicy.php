<?php

declare(strict_types=1);

namespace App\Supervision\Policies;

use App\Actors\Contracts\Policy;
use App\Supervision\Models\Ask;

/**
 * Who may act on Ask records; the grant decides, and the handlers keep their own checks.
 */
final readonly class AskPolicy implements Policy
{
    public static function model(): string
    {
        return Ask::class;
    }
}
