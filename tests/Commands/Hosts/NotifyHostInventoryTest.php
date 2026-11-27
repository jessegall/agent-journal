<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\ClaimHostInstructions\ClaimHostInstructionsCommand;
use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Exceptions\HostProtocolUnsupported;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostProcessType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\Payloads\HostInventoryPayload;
use App\Models\Hosts\HostInstruction;
use App\Values\HostInstructionSource;
use App\Values\RowGuard;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * After a host started, a process it still runs is kept, one it no longer holds is lost, one opened after its
 * inventory was built is left alone and its claimed opening offered again, and every input instruction it had claimed is
 * refused host_restarted.
 */
#[TestsCommand(NotifyHostInventoryCommand::class)]
final class NotifyHostInventoryTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_held_processes_are_kept_missing_ones_lost_newer_ones_offered_again_and_claimed_keys_refused(): void
    {
        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('kept')->openProcess('gone'))
            ->hostProcess('kept', fn (TestHostProcess $kept) => $kept->report(HostProcessReportType::Running))
            ->hostProcess('gone', fn (TestHostProcess $gone) => $gone->report(HostProcessReportType::Running));
        [$goneOpen] = $this->journal->hostInstructionsOf('gone');
        $this->journal->hostInstruction($goneOpen, fn (TestHostInstruction $instruction) => $instruction
            ->answer())->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('newer'));
        $hostId = $this->journal->hostCalled('Mac')->hostId;
        $kept = $this->journal->hostProcessCalled('kept')->id;
        $keys = new SendHostKeysCommand($kept, 'hi', new RowGuard(0, 0, 'rows'), 0, HostInstructionSource::fromJournal());
        $keysId = $this->journal->asSystem($keys);
        $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 50));
        $inventory = HostInventoryPayload::from([
            'protocol' => 1,
            'release' => '6.0.0',
            'answered_through' => $goneOpen->id,
            'capabilities' => [],
            'processes' => [[
                'process_id' => $kept,
                'identity' => 'pid:kept',
                'is_alive' => true,
                'is_terminal_held' => false,
                'spool_offset' => 0,
            ]],
        ]);

        $this->journal->asSystem(new NotifyHostInventoryCommand($hostId, $inventory));

        $refused = HostInstruction::query()->whereKey($keysId)->sole();
        [$newerOpen] = $this->journal->hostInstructionsOf('newer');
        $this->journal->assertResult(
            [
                HostProcessStatus::Running,
                HostProcessStatus::Lost,
                HostProcessStatus::Ordered,
                HostInstructionStatus::Refused,
                HostRefusal::HostRestarted,
                HostInstructionStatus::Pending,
            ],
            [
                $this->journal->hostProcessCalled('kept')->status,
                $this->journal->hostProcessCalled('gone')->status,
                $this->journal->hostProcessCalled('newer')->status,
                $refused->status,
                $refused->refusal,
                $newerOpen->status,
            ],
        );
    }

    public function test_a_pipe_whose_host_holds_less_output_than_it_sent_is_lost(): void
    {
        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('turn', HostProcessType::Pipe))
            ->hostProcess('turn', fn (TestHostProcess $turn) => $turn
                ->report(HostProcessReportType::Running)->printOnPipe("{\"type\":\"system\"}\n"));
        $process = $this->journal->hostProcessCalled('turn');
        $inventory = HostInventoryPayload::from([
            'protocol' => 1,
            'release' => '6.0.0',
            'capabilities' => [],
            'processes' => [[
                'process_id' => $process->id,
                'identity' => 'pid:turn',
                'is_alive' => true,
                'is_terminal_held' => false,
                'spool_offset' => 0,
            ]],
        ]);

        $this->journal->asSystem(new NotifyHostInventoryCommand($process->host_id, $inventory));

        $this->journal->assertResult(
            [HostProcessStatus::Lost, 'the host restarted without the output it had already sent'],
            [$process->refresh()->status, $process->exit_evidence],
        );
    }

    public function test_a_host_that_names_no_protocol_is_told_to_update(): void
    {
        $this->journal->enrollHost('Mac', [base_path()]);
        $inventory = HostInventoryPayload::from([
            'protocol' => 0,
            'release' => '5.9.0',
            'capabilities' => [],
            'processes' => [],
        ]);

        $this->journal->assertRefused(
            HostProtocolUnsupported::class,
            fn () => $this->journal->asSystem(new NotifyHostInventoryCommand(
                $this->journal->hostCalled('Mac')->hostId,
                $inventory,
            )),
        );
    }
}
