<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Exceptions\HostProtocolRefused;
use App\Hosts\Commands\MakeHostFolder\MakeHostFolderCommand;
use App\Hosts\Commands\ReadFolderUse\ReadFolderUseCommand;
use App\Hosts\Commands\ReadHostFolderAnswer\ReadHostFolderAnswerCommand;
use App\Hosts\Protocol\HostRefusal;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The runner reads its own host's folder instruction: waiting, done with what the host found, or refused with the host's
 * reason; another host's instruction is refused.
 */
#[TestsCommand(ReadHostFolderAnswerCommand::class)]
final class ReadHostFolderAnswerTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_it_answers_where_the_hosts_own_instruction_stands(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()])->enrollContainedHost('Other', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;
        $made = $this->journal->asSystem(new ReadFolderUseCommand($hostId, 'a7', 'operation-1'));
        $used = $this->journal->asSystem(new MakeHostFolderCommand($hostId, 'a8', 'operation-2'));
        $waiting = $this->journal->asSystem(new ReadHostFolderAnswerCommand($hostId, $made));
        [$first, $second] = $this->journal->hostInstructionsOn('Box');

        $this->journal->hostInstruction($first, fn (TestHostInstruction $instruction) => $instruction
            ->answerWith(['is_bound' => true]))->hostInstruction($second, fn (TestHostInstruction $instruction) => $instruction
            ->refuse(HostRefusal::Unsafe));
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
