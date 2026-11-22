<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Policy;
use App\Models\Ask;

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
