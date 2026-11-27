<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\ReadFolderUse\ReadFolderUseCommand;
use App\Hosts\Protocol\HostInstructionType;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The host is ordered to use an account folder once for each operation: the same operation asked again finds the
 * instruction already made.
 */
#[TestsCommand(ReadFolderUseCommand::class)]
final class ReadFolderUseTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_host_is_ordered_once_for_the_operation(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;

        $first = $this->journal->asSystem(new ReadFolderUseCommand($hostId, 'a7', 'operation-1'));
        $again = $this->journal->asSystem(new ReadFolderUseCommand($hostId, 'a7', 'operation-1'));
        $other = $this->journal->asSystem(new ReadFolderUseCommand($hostId, 'a7', 'operation-2'));

        $instruction = $this->journal->hostInstructionsOn('Box')[0];
        $this->journal->assertResult(
            [$first, false, HostInstructionType::ListContainers, ['name' => 'journal.account', 'value' => 'a7'], 2],
            [
                $again,
                $first === $other,
                $instruction->type,
                $this->journal->payloadOf($instruction),
                count($this->journal->hostInstructionsOn('Box')),
            ],
        );
    }
}
