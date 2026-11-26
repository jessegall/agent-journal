<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\ClaimHostOrders\ClaimHostOrdersCommand;
use App\Enums\Hosts\HostOrderStatus;
use App\Models\Projects\Host;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A host's claim takes every order waiting for it, signed, and an order once claimed is not handed out again at once.
 */
#[TestsCommand(ClaimHostOrdersCommand::class)]
final class ClaimHostOrdersTest extends TestCase
{
    public function test_every_waiting_order_is_claimed_signed_and_not_handed_out_twice(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'second')->openHostProcess('Mac', 'first');
        $hostId = $this->journal->hostCalled('Mac')->hostId;
        [$open] = $this->journal->hostOrdersOf('first');

        $claim = $this->journal->asSystem(new ClaimHostOrdersCommand($hostId, 10));
        $again = $this->journal->asSystem(new ClaimHostOrdersCommand($hostId, 10));

        $orders = array_column(array_map(fn ($order) => $order->jsonSerialize(), $claim->orders), null, 'id');
        $this->journal->assertResult(
            [2, Host::query()->whereKey($hostId)->sole()->signOrder($open->refresh()), HostOrderStatus::Claimed, true],
            [count($orders), $orders[$open->id]['signature'], $open->status, $again->isEmpty()],
        );
    }

    public function test_a_host_claims_none_of_another_hosts_orders(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->enrollHost('Other', [base_path()])->openHostProcess('Mac', 'shell');

        $claim = $this->journal->asSystem(new ClaimHostOrdersCommand($this->journal->hostCalled('Other')->hostId, 10));

        $this->journal->assertResult(true, $claim->isEmpty());
    }
}
