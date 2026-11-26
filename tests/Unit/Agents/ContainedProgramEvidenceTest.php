<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Agents\Drivers\Contracts\DriverCompatibilities;
use App\Agents\Drivers\DefaultDrivers;
use App\Support\Compatibility\DriverCompatibility;
use Tests\TestCase;

/**
 * Contained, a driver's arrangement is shown only by a contained host's report that every item is enforced in the
 * agent image; until then a start is refused naming what is missing.
 */
final class ContainedProgramEvidenceTest extends TestCase
{
    public function test_the_local_arrangement_answers_the_pinned_compatibility_as_before(): void
    {
        $this->assertEquals(
            DriverCompatibility::pinned(DefaultDrivers::CLAUDE_CODE),
            $this->compatibility(DefaultDrivers::CLAUDE_CODE),
        );
    }

    private function compatibility(string $driver): DriverCompatibility
    {
        return $this->app->make(DriverCompatibilities::class)->for($driver);
    }
}
