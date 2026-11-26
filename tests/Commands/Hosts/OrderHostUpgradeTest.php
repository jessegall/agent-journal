<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\OrderHostUpgrade\OrderHostUpgradeCommand;
use App\Enums\Hosts\HostOrderType;
use App\Exceptions\HostUpgradeRefused;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The upgrade is ordered only to a host with no live process.
 */
#[TestsCommand(OrderHostUpgradeCommand::class)]
final class OrderHostUpgradeTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->publishRelease('6.1.0')->enrollHost('Mac', [base_path()]);
    }

    public function test_it_orders_the_upgrade_and_answers_the_orders_id(): void
    {
        $orderId = $this->journal->asSystem(new OrderHostUpgradeCommand($this->journal->hostCalled('Mac')->hostId));

        $order = $this->journal->hostOrdersOn('Mac')[0];
        $this->journal->assertResult([$orderId, HostOrderType::Upgrade], [$order->id, $order->type]);
    }

    public function test_it_is_refused_while_a_process_lives_on_the_host(): void
    {
        $this->journal->openHostProcess('Mac', 'shell');

        $this->journal->assertRefused(
            HostUpgradeRefused::class,
            fn () => $this->journal->asSystem(new OrderHostUpgradeCommand($this->journal->hostCalled('Mac')->hostId)),
        );
    }
}
