<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\MakeHostFolder\MakeHostFolderCommand;
use App\Commands\Hosts\ReadHostFolderAnswer\ReadHostFolderAnswerCommand;
use App\Enums\Hosts\HostRefusal;
use App\Exceptions\HostProtocolRefused;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The runner reads its own host's folder order: waiting, done with what the host found, or refused with the host's
 * reason; another host's order is refused.
 */
#[TestsCommand(ReadHostFolderAnswerCommand::class)]
final class ReadHostFolderAnswerTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_it_answers_where_the_hosts_own_order_stands(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()])->enrollContainedHost('Other', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;
        $made = $this->journal->asSystem(new MakeHostFolderCommand($hostId, 'a7', 'operation-1'));
        $used = $this->journal->asSystem(new MakeHostFolderCommand($hostId, 'a8', 'operation-2'));
        $waiting = $this->journal->asSystem(new ReadHostFolderAnswerCommand($hostId, $made));
        [$first, $second] = $this->journal->hostOrdersOn('Box');

        $this->journal->answerHostOrderWith($first, ['is_bound' => true])->refuseHostOrder($second, HostRefusal::Unsafe);
        $done = $this->journal->asSystem(new ReadHostFolderAnswerCommand($hostId, $made));
        $refused = $this->journal->asSystem(new ReadHostFolderAnswerCommand($hostId, $used));

        $this->journal->assertResult(
            [true, true, true, true, 'unsafe'],
            [$waiting->isPending(), $done->isDone(), $done->isBound, $refused->isRefused(), $refused->reason],
        );
        $this->journal->assertRefused(
            HostProtocolRefused::class,
            fn () => $this->journal->asSystem(
                new ReadHostFolderAnswerCommand($this->journal->hostCalled('Other')->hostId, $made),
            ),
        );
    }
}
