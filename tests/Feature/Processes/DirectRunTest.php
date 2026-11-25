<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use Tests\Support\Processes\RunsDirectLines;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A line an agent runs directly goes through the same admission as a hook: a refusal starts nothing and names its
 * request, an admitted line runs supervised and answers its output number and results.
 */
final class DirectRunTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsDirectLines;

    #[TimeLimit(10, 'It admits and runs printf through the signed channel.')]
    public function test_process_run_line_refuses_or_runs_and_prints_its_output_number(): void
    {
        $this->journal->relayAgentCommands($this->start);

        $this->artisan('process:run', ['--line' => 'acme verify'])
            ->expectsOutputToContain('Nothing in this request started.')
            ->assertExitCode(1);
        $this->artisan('process:run', ['--line' => 'printf direct'])
            ->expectsOutputToContain('Output ')
            ->assertExitCode(0);
    }
}
