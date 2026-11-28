<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings\Scenarios;

use App\Support\Recordings\Recordings;
use App\Support\Recordings\Scenarios\Scenario;
use Tests\TestCase;

/**
 * Every scenario file under resources/recordings/scenarios is read whole by the scenario parser, with a description,
 * and each start names a model and an effort.
 */
final class ScenarioFilesTest extends TestCase
{
    public function test_every_scenario_file_parses_with_a_description(): void
    {
        $files = glob(base_path(Recordings::SCENARIOS).'/*/*.json') ?: [];
        $read = [];

        foreach ($files as $file) {
            $name = basename(dirname($file)).'/'.basename($file, '.json');
            $scenario = Scenario::read($name, (string) file_get_contents($file));
            $read[$name] = $scenario->description !== '' && $scenario->steps !== [];
        }

        $this->assertNotSame([], $read);
        $this->assertSame([], array_keys(array_filter($read, fn (bool $isWhole) => ! $isWhole)));
    }
}
