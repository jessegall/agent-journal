<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\ClaimHostOrders\ClaimHostOrdersCommand;
use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Enums\HostOrderStatus;
use App\Hosts\Enums\HostProcessReportType;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Enums\HostProcessType;
use App\Hosts\Exceptions\HostProtocolUnsupported;
use App\Hosts\Protocol\HostRefusal;
use App\Models\Hosts\HostOrder;
use App\Values\HostOrderSource;
use App\Values\RowGuard;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostOrder;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * After a host started, a process it still runs is kept, one it no longer holds is lost, one opened after its
 * inventory was built is left alone and its claimed opening offered again, and every input order it had claimed is
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
        [$goneOpen] = $this->journal->hostOrdersOf('gone');
        $this->journal->hostOrder($goneOpen, fn (TestHostOrder $order) => $order
            ->answer())->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('newer'));
        $hostId = $this->journal->hostCalled('Mac')->hostId;
        $kept = $this->journal->hostProcessCalled('kept')->id;
        $keys = new SendHostKeysCommand($kept, 'hi', new RowGuard(0, 0, 'rows'), 0, HostOrderSource::fromJournal());
        $keysId = $this->journal->asSystem($keys);
        $this->journal->asSystem(new ClaimHostOrdersCommand($hostId, 50));
        $inventory = json_encode([
            'protocol' => 1,
            'release' => '6.0.0',
            'answered_through' => $goneOpen->id,
            'processes' => [['process_id' => $kept, 'identity' => 'pid:kept', 'is_alive' => true]],
        ], JSON_THROW_ON_ERROR);

        $this->journal->asSystem(new NotifyHostInventoryCommand($hostId, $inventory));

        $refused = HostOrder::query()->whereKey($keysId)->sole();
        [$newerOpen] = $this->journal->hostOrdersOf('newer');
        $this->journal->assertResult(
            [
                HostProcessStatus::Running,
                HostProcessStatus::Lost,
                HostProcessStatus::Ordered,
                HostOrderStatus::Refused,
                HostRefusal::HostRestarted,
                HostOrderStatus::Pending,
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
        $inventory = json_encode([
            'protocol' => 1,
            'release' => '6.0.0',
            'answered_through' => null,
            'processes' => [['process_id' => $process->id, 'identity' => 'pid:turn', 'is_alive' => true, 'spool_offset' => 0]],
        ], JSON_THROW_ON_ERROR);

        $this->journal->asSystem(new NotifyHostInventoryCommand($process->host_id, $inventory));

        $this->journal->assertResult(
            [HostProcessStatus::Lost, 'the host restarted without the output it had already sent'],
            [$process->refresh()->status, $process->exit_evidence],
        );
    }

    public function test_a_host_that_names_no_protocol_is_told_to_update(): void
    {
        $this->journal->enrollHost('Mac', [base_path()]);
        $inventory = json_encode(['release' => '5.9.0', 'answered_through' => null], JSON_THROW_ON_ERROR);

        $this->journal->assertRefused(
            HostProtocolUnsupported::class,
            fn () => $this->journal->asSystem(new NotifyHostInventoryCommand(
                $this->journal->hostCalled('Mac')->hostId,
                $inventory,
            )),
        );
    }
}
