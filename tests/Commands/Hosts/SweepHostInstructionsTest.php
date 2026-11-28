<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\ClaimHostInstructions\ClaimHostInstructionsCommand;
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

    public function test_an_open_claimed_in_time_can_answer_after_the_claim_deadline(): void
    {
        $placed = CarbonImmutable::parse('2026-11-26 10:00:00');
        $this->journal
            ->useServerClockAt($placed)
            ->enrollHost('Mac', [base_path()])
            ->enrollHost('Spare', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $host) => $host->openProcess('timely'))
            ->host('Spare', fn (TestEnrolledHost $host) => $host->openProcess('unclaimed'));
        [$timely] = $this->journal->hostInstructionsOf('timely');
        [$unclaimed] = $this->journal->hostInstructionsOf('unclaimed');
        $this->journal->moveServerClockTo($placed->addSeconds(23))
            ->asSystem(new ClaimHostInstructionsCommand($timely->host_id, 1));

        $this->assertNotNull($timely->refresh()->claimed_at);
        $this->assertNull($unclaimed->refresh()->claimed_at);
        $this->journal->moveServerClockTo($placed->addSeconds(33))
            ->asSystem(new SweepHostInstructionsCommand());

        $this->assertSame(HostInstructionStatus::Claimed, $timely->refresh()->status);
        $this->assertSame(HostRefusal::Expired, $unclaimed->refresh()->refusal);
        $this->journal->hostInstruction($timely, fn (TestHostInstruction $open) => $open->answer());
        $this->assertSame(HostInstructionStatus::Done, $timely->refresh()->status);
    }
}
