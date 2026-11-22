<?php

declare(strict_types=1);

namespace Domain\Helpers\Policies;

use App\Contracts\Policy;
use Domain\Helpers\Models\HelperJob;

/**
 * Who may dispatch helpers: the grants decide; whether the caller's policy delegates, and no more than it holds, is
 * the dispatch's own invariant, for every actor.
 */
final readonly class HelperPolicy implements Policy
{
    public static function model(): string
    {
        return HelperJob::class;
    }
}
