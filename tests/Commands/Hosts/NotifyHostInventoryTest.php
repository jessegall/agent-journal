<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\ClaimHostOrders\ClaimHostOrdersCommand;
use App\Commands\Hosts\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Commands\Hosts\SendHostKeys\SendHostKeysCommand;
use App\Enums\Hosts\HostOrderStatus;
use App\Enums\Hosts\HostProcessReportType;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\HostRefusal;
use App\Models\Hosts\HostOrder;
use App\Values\HostOrderSource;
use App\Values\RowGuard;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * After a host started, a process it still runs is kept, one it no longer holds is lost, one opened after its
 * inventory was built is left alone, and every input order it had claimed is refused host_restarted.
 */
#[TestsCommand(NotifyHostInventoryCommand::class)]
final class NotifyHostInventoryTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_held_processes_are_kept_missing_ones_lost_newer_ones_left_and_claimed_keys_refused(): void
    {
        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'kept')
            ->openHostProcess('Mac', 'gone')
            ->reportHostProcess('kept', HostProcessReportType::Running)
            ->reportHostProcess('gone', HostProcessReportType::Running);
        [$goneOpen] = $this->journal->hostOrdersOf('gone');
        $this->journal->answerHostOrder($goneOpen)->openHostProcess('Mac', 'newer');
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
        $this->journal->assertResult(
            [
                HostProcessStatus::Running,
                HostProcessStatus::Lost,
                HostProcessStatus::Ordered,
                HostOrderStatus::Refused,
                HostRefusal::HostRestarted,
            ],
            [
                $this->journal->hostProcessCalled('kept')->status,
                $this->journal->hostProcessCalled('gone')->status,
                $this->journal->hostProcessCalled('newer')->status,
                $refused->status,
                $refused->refusal,
            ],
        );
    }
}
