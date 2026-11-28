<?php

declare(strict_types=1);

namespace Tests\Unit\Sessions;

use App\Agents\Drivers\Enums\DriverType;
use App\Sessions\StartPreviews;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Every start runs headless (user 30877): a start that names no mode runs headless, a terminal saved before falls to
 * headless, and a start that names the terminal is offered nothing.
 */
final class HeadlessOnlyStartsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_start_runs_headless_whatever_the_agent_saved_or_its_profile_defaults_to(): void
    {
        $agent = $this->journal->owner()->idleAgent('Coder')->agentCalled('Coder');
        $agent->driver_type_preference = DriverType::Terminal;

        $this->journal->assertResult(
            [DriverType::Headless, DriverType::Headless, DriverType::Headless],
            [
                $agent->driverTypeFor(null, DriverType::Terminal),
                $this->journal->service(StartPreviews::class)->chosenDriverType($agent, 'claude-code', null, DriverType::Terminal)[0],
                $this->journal->service(StartPreviews::class)->chosenDriverType($agent, 'codex', null, DriverType::Terminal)[0],
            ],
        );
    }
}
