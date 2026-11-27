<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\CloseHostPrivateEntry\CloseHostPrivateEntryCommand;
use App\Hosts\Protocol\HostInstructionType;
use App\Values\HostInstructionSource;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Closing a private entry instructs the host to end the shield it put up; the instruction carries nothing.
 */
#[TestsCommand(CloseHostPrivateEntryCommand::class)]
final class CloseHostPrivateEntryTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_close_instruction_goes_to_the_processs_host_with_no_payload(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('claude'));
        $process = $this->journal->hostProcessCalled('claude');

        $this->journal->asSystem(new CloseHostPrivateEntryCommand($process->id, HostInstructionSource::fromJournal()));

        $instruction = $this->journal->hostInstructionsOf('claude')[1];
        $this->journal->assertResult(
            [HostInstructionType::ClosePrivate, $process->host_id, []],
            [$instruction->type, $instruction->host_id, $this->journal->payloadOf($instruction)],
        );
    }
}
