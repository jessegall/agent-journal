<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Leaves the fixture's record effects to the acting profile's grants.
 */
final readonly class TaskWatchPolicy implements Policy
{
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
