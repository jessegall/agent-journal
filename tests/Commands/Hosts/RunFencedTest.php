<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\RunFenced\RunFencedCommand;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Values\FencedRun;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A fenced run instructions the host itself to close the fence, spare the processes that wait on it and run each program
 * within the budget.
 */
#[TestsCommand(RunFencedCommand::class)]
final class RunFencedTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_it_instructs_the_host_with_the_fence_the_waiting_processes_and_each_run(): void
    {
        $this->journal->enrollHost('Mac', [base_path()]);
        $run = new FencedRun(['/usr/bin/git', 'status'], '/work', 10000, 4096);

        $instructionId = $this->journal->asSystem(new RunFencedCommand(
            $this->journal->hostCalled('Mac')->hostId,
            'session-1',
            ['terminal-1'],
            [$run],
            30000,
        ));

        $instruction = $this->journal->hostInstructionsOn('Mac')[0];
        $this->journal->assertResult(
            [
                $instructionId,
                HostInstructionType::RunFenced,
                [
                    'fence' => 'session-1',
                    'waiting' => ['terminal-1'],
                    'budget_ms' => 30000,
                    'runs' => [$run->plan()->toArray()],
                ],
            ],
            [$instruction->id, $instruction->type, $this->journal->payloadOf($instruction)],
        );
    }
}
