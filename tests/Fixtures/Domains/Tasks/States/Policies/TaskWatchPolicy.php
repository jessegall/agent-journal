<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Policies;

use App\Contracts\Authorization\Policy;
use Tests\Fixtures\Domains\Tasks\States\Models\TaskWatch;

/**
 * Leaves the fixture's record effects to the acting profile's grants.
 */
final readonly class TaskWatchPolicy implements Policy
{
    public static function model(): string
    {
        return TaskWatch::class;
    }
}
