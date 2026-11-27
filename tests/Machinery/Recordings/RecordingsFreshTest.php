<?php

declare(strict_types=1);

namespace Tests\Machinery\Recordings;

use App\Recordings\Exceptions\RecordingMissing;
use App\Recordings\Exceptions\RecordingStale;
use App\Recordings\Recordings;
use Tests\TestCase;

/**
 * Every scenario a definition file names is recorded under resources/recordings, and its recording stands for the code
 * as it is: none is stale for its format, its protocol, its scenario or the agent image's programs.
 */
final class RecordingsFreshTest extends TestCase
{
    public function test_every_scenario_is_recorded_and_fresh(): void
    {
        $recordings = $this->app->make(Recordings::class);
        $refusals = [];

        foreach ($recordings->scenarioNames() as $scenario) {
            try {
                $recordings->scenario(...explode('/', $scenario, 2));
            } catch (RecordingMissing|RecordingStale $refused) {
                $refusals[] = $refused->getMessage();
            }
        }

        $this->assertSame([], $refusals, 'Record each with scripts/record-scenarios.sh.');
    }
}
