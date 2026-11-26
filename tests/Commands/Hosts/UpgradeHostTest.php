<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Commands\Hosts\UpgradeHost\UpgradeHostCommand;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessReportType;
use App\Enums\Hosts\HostRefusal;
use App\Exceptions\HostUpgradeRefused;
use App\Models\Projects\Host;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A connected host moves to the published release: its processes are stopped first and the upgrade is ordered once the
 * last one ended.
 */
#[TestsCommand(UpgradeHostCommand::class)]
final class UpgradeHostTest extends TestCase
{
    use RefreshHookDatabase;

    private const string RELEASE = '6.1.0';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->publishRelease(self::RELEASE)->enrollHost('Mac', [base_path()]);
    }

    public function test_a_quiet_host_is_ordered_the_upgrade_with_the_signed_manifest_at_once(): void
    {
        $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), self::RELEASE));

        $order = $this->journal->hostOrdersOn('Mac')[0];
        $payload = $this->journal->payloadOf($order);
        $this->journal->assertResult(
            [HostOrderType::Upgrade, self::RELEASE, self::RELEASE, base64_encode('signature'), 'claude', $order->id],
            [
                $order->type,
                $payload['version'],
                json_decode($payload['manifest'], true, flags: JSON_THROW_ON_ERROR)['version'],
                $payload['signature'],
                json_decode($payload['programs'], true, flags: JSON_THROW_ON_ERROR)['programs'][0]['executable'],
                $this->host()->upgrade_order_id,
            ],
        );
    }

    public function test_a_host_with_a_live_process_has_it_stopped_and_is_ordered_once_it_ended(): void
    {
        $this->journal->openHostProcess('Mac', 'shell');

        $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), self::RELEASE));
        $stops = $this->journal->hostOrdersOf('shell');
        $beforeEnd = $this->journal->hostOrdersOn('Mac');
        $this->journal->reportHostProcess('shell', HostProcessReportType::Exited, 0);

        $this->journal->assertResult(
            [HostOrderType::Stop, [], [HostOrderType::Upgrade]],
            [
                end($stops)->type,
                $beforeEnd,
                array_map(fn ($order) => $order->type, $this->journal->hostOrdersOn('Mac')),
            ],
        );
    }

    public function test_a_release_the_journal_does_not_publish_is_refused(): void
    {
        $this->journal->assertRefused(
            HostUpgradeRefused::class,
            fn () => $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), '6.0.9')),
        );
    }

    public function test_a_host_whose_inventory_names_no_upgrade_is_refused(): void
    {
        $inventory = ['protocol' => 1, 'release' => '6.0.0', 'answered_through' => null, 'capabilities' => ['stop']];
        $body = json_encode($inventory, JSON_THROW_ON_ERROR);
        $this->journal->asSystem(new NotifyHostInventoryCommand($this->hostId(), $body));

        $this->journal->assertRefused(
            HostUpgradeRefused::class,
            fn () => $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), self::RELEASE)),
        );
    }

    public function test_a_new_upgrade_clears_the_failure_of_the_last(): void
    {
        $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), self::RELEASE));
        $this->journal->refuseHostOrder($this->journal->hostOrdersOn('Mac')[0], HostRefusal::Fenced);

        $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), self::RELEASE));

        $this->journal->assertResult(
            [null, self::RELEASE],
            [$this->host()->upgrade_failure, $this->host()->upgrade_release],
        );
    }

    private function hostId(): string
    {
        return $this->journal->hostCalled('Mac')->hostId;
    }

    private function host(): Host
    {
        return Host::query()->whereKey($this->hostId())->sole();
    }
}
