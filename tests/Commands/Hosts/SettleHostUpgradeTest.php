<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Commands\Hosts\SettleHostUpgrade\SettleHostUpgradeCommand;
use App\Commands\Hosts\UpgradeHost\UpgradeHostCommand;
use App\Enums\Hosts\HostRefusal;
use App\Models\Projects\Host;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A refused upgrade order fails the host's upgrade with its reason; a done one waits for the new release's inventory,
 * which ends the upgrade.
 */
#[TestsCommand(SettleHostUpgradeCommand::class)]
final class SettleHostUpgradeTest extends TestCase
{
    use RefreshHookDatabase;

    private const string RELEASE = '6.1.0';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->publishRelease(self::RELEASE)->enrollHost('Mac', [base_path()]);
        $this->journal->asSystem(new UpgradeHostCommand($this->journal->hostCalled('Mac')->hostId, self::RELEASE));
    }

    public function test_a_refused_order_fails_the_upgrade_with_the_hosts_reason(): void
    {
        $this->journal->refuseHostOrder($this->journal->hostOrdersOn('Mac')[0], HostRefusal::Fenced);

        $this->journal->assertResult(
            [null, 'The host refused the upgrade: fenced.'],
            [$this->host()->upgrade_release, $this->host()->upgrade_failure],
        );
    }

    public function test_a_done_order_waits_until_the_inventory_names_the_new_release(): void
    {
        $this->journal->answerHostOrderWith($this->journal->hostOrdersOn('Mac')[0], ['release' => self::RELEASE]);
        $waiting = $this->host()->upgrade_release;
        $this->journal->asSystem(new NotifyHostInventoryCommand($this->host()->id, $this->inventory()));

        $this->journal->assertResult(
            [self::RELEASE, null, self::RELEASE, null],
            [$waiting, $this->host()->upgrade_release, $this->host()->release, $this->host()->upgrade_failure],
        );
    }

    private function host(): Host
    {
        return Host::query()->whereKey($this->journal->hostCalled('Mac')->hostId)->sole();
    }

    private function inventory(): string
    {
        return json_encode([
            'protocol' => 1,
            'release' => self::RELEASE,
            'answered_through' => null,
            'capabilities' => [],
            'processes' => [],
        ], JSON_THROW_ON_ERROR);
    }
}
