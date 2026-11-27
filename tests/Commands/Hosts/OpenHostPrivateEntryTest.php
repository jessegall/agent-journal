<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\OpenHostPrivateEntry\OpenHostPrivateEntryCommand;
use App\Hosts\Protocol\HostInstructionType;
use App\Values\HostInstructionSource;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Opening a private entry instructs the host to shield the process's screen and input until it closes; the instruction carries nothing.
 */
#[TestsCommand(OpenHostPrivateEntryCommand::class)]
final class OpenHostPrivateEntryTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_open_instruction_goes_to_the_processs_host_with_no_payload(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('claude'));
        $process = $this->journal->hostProcessCalled('claude');

        $this->journal->asSystem(new OpenHostPrivateEntryCommand($process->id, HostInstructionSource::fromJournal()));

        $instruction = $this->journal->hostInstructionsOf('claude')[1];
        $this->journal->assertResult(
            [HostInstructionType::OpenPrivate, $process->host_id, []],
            [$instruction->type, $instruction->host_id, $this->journal->payloadOf($instruction)],
        );
    }
}
