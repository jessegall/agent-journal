<?php

declare(strict_types=1);

namespace Domain\Documents\Policies;

use App\Access\Contracts\Policy;
use Domain\Documents\Models\Report;

/**
 * Who may act on Report records; the grant decides, and the handlers keep their own checks.
 */
final readonly class ReportPolicy implements Policy
{
    public static function model(): string
    {
        return Report::class;
    }
}
