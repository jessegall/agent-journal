<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\NotifyHostHeartbeat\NotifyHostHeartbeatCommand;
use App\Enums\Hosts\HostProcessStatus;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A process its host's heartbeats leave out is lost on the second in a row, but never by a heartbeat built before
 * the host answered the order that opened it.
 */
#[TestsCommand(NotifyHostHeartbeatCommand::class)]
final class NotifyHostHeartbeatTest extends TestCase
{
    public function test_a_just_opened_process_is_not_lost_and_one_left_out_twice_is(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'old')->openHostProcess('Mac', 'new');
        [$oldOpen] = $this->journal->hostOrdersOf('old');
        $this->journal->answerHostOrder($oldOpen);
        $beat = new NotifyHostHeartbeatCommand($this->journal->hostCalled('Mac')->hostId, [], $oldOpen->id);

        $this->journal->asSystem($beat);
        $afterOne = $this->journal->hostProcessCalled('old')->status;
        $this->journal->asSystem($beat);

        $this->journal->assertResult(
            [HostProcessStatus::Ordered, HostProcessStatus::Lost, HostProcessStatus::Ordered],
            [$afterOne, $this->journal->hostProcessCalled('old')->status, $this->journal->hostProcessCalled('new')->status],
        );
    }
}
