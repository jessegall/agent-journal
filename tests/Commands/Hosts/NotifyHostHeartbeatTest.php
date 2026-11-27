<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\NotifyHostHeartbeat\NotifyHostHeartbeatCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Models\Agents\AgentRuntime;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A process its host's heartbeats leave out is lost on the second in a row, but never by a heartbeat built before
 * the host answered the order that opened it.
 */
#[TestsCommand(NotifyHostHeartbeatCommand::class)]
final class NotifyHostHeartbeatTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_just_opened_process_is_not_lost_and_one_left_out_twice_is(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('old')->openProcess('new'));
        [$oldOpen] = $this->journal->hostInstructionsOf('old');
        $this->journal->hostInstruction($oldOpen, fn (TestHostInstruction $instruction) => $instruction->answer());
        $beat = new NotifyHostHeartbeatCommand($this->journal->hostCalled('Mac')->hostId, [], $oldOpen->id);

        $this->journal->asSystem($beat);
        $afterOne = $this->journal->hostProcessCalled('old')->status;
        $this->journal->asSystem($beat);

        $this->journal->assertResult(
            [HostProcessStatus::Ordered, HostProcessStatus::Lost, HostProcessStatus::Ordered],
            [$afterOne, $this->journal->hostProcessCalled('old')->status, $this->journal->hostProcessCalled('new')->status],
        );
    }

    /**
     * A runtime reports nothing between two turns, so a heartbeat that sees its process confirms that what the runtime
     * last reported still holds.
     */
    public function test_a_process_the_heartbeat_sees_keeps_its_runtimes_report_fresh(): void
    {
        $this->journal->owner()->chooseActiveAccounts()->showDriverArrangements()->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), firstMessage: 'Run: ls.')
            ->nameProcess('probe', HostProcessPurpose::BuildProbe));
        $runtimeId = $this->journal->openedRuntimeOf('Driven')->runtimeId;
        $before = AgentRuntime::query()->findOrFail($runtimeId)->last_observed_at;

        $this->journal->asSystem(new NotifyHostHeartbeatCommand(
            $this->journal->hostCalled('Mac')->hostId,
            [$this->journal->hostProcessCalled('probe')->id],
            null,
        ));

        $this->journal->assertResult(
            [null, true],
            [$before, AgentRuntime::query()->findOrFail($runtimeId)->last_observed_at !== null],
        );
    }
}
