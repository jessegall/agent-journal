<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Policies;

use App\Contracts\Policy;
use Tests\Fixtures\Bus\Models\FixtureWork;

/**
 * The policy of the bus and module fixture commands: every granted actor may run them, so the grants decide.
 */
final readonly class FixturePolicy implements Policy
{
    public static function model(): string
    {
        return FixtureWork::class;
    }
}
