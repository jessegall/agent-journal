<?php

declare(strict_types=1);

namespace Tests\Machinery\Sessions;

use App\Agents\Drivers\Enums\DriverType;
use App\Sessions\StartPreviews;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Every start the journal makes runs headless (users 30877, 30893): whatever the agent saved or its profile defaults
 * to, the start's mode is headless.
 */
#[TestsMachinery(StartPreviews::class)]
final class HeadlessOnlyStartsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_start_runs_headless_whatever_the_agent_saved_or_its_profile_defaults_to(): void
    {
        $agent = $this->journal->owner()->idleAgent('Coder')->agentCalled('Coder');
        $agent->driver_type_preference = DriverType::Terminal;

        $this->journal->assertResult(
            [DriverType::Headless, DriverType::Headless],
            [
                $this->journal->service(StartPreviews::class)->chosenDriverType($agent, 'claude-code', null, DriverType::Terminal)[0],
                $this->journal->service(StartPreviews::class)->chosenDriverType($agent, 'codex', null, DriverType::Terminal)[0],
            ],
        );
    }
}
