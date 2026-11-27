<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Commands\SweepHostInstructions\SweepHostInstructionsCommand;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Protocol\HostRefusal;
use App\Values\HostInstructionSource;
use App\Values\RowGuard;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An instruction nobody answered in time expires on the journal's clock, a key write forgets its bytes once answered, and
 * answered instructions are deleted after their hour.
 */
#[TestsCommand(SweepHostInstructionsCommand::class)]
final class SweepHostInstructionsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_unanswered_instruction_expires_answered_keys_forget_their_bytes_and_old_instructions_go(): void
    {
        $this->journal
            ->useServerClockAt(CarbonImmutable::parse('2026-11-26 10:00:00'))
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'));
        $process = $this->journal->hostProcessCalled('shell')->id;
        $keys = new SendHostKeysCommand($process, 'hi', new RowGuard(0, 0, 'rows'), 0, HostInstructionSource::fromJournal());
        $this->journal->asSystem($keys);
        [$open, $typed] = $this->journal->hostInstructionsOf('shell');
        $this->journal->hostInstruction($typed, fn (TestHostInstruction $instruction) => $instruction->answer());
        $erased = $this->journal->payloadOf($typed->refresh());

        $this->journal->moveServerClockTo(CarbonImmutable::parse('2026-11-26 10:01:00'));
        $this->journal->asSystem(new SweepHostInstructionsCommand());
        $open->refresh();
        $afterExpiry = [$open->status, $open->refusal];
        $this->journal->moveServerClockTo(CarbonImmutable::parse('2026-11-26 12:00:00'));
        $this->journal->asSystem(new SweepHostInstructionsCommand());

        $this->journal->assertResult(
            [[], [HostInstructionStatus::Refused, HostRefusal::Expired], []],
            [$erased, $afterExpiry, $this->journal->hostInstructionsOf('shell')],
        );
    }
}
