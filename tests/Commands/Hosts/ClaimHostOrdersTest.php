<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\ClaimHostOrders\ClaimHostOrdersCommand;
use App\Commands\Hosts\WriteHostInput\WriteHostInputCommand;
use App\Enums\Hosts\HostOrderStatus;
use App\Enums\Hosts\HostProcessReportType;
use App\Enums\Hosts\HostProcessType;
use App\Models\Hosts\HostOrder;
use App\Models\Projects\Host;
use App\Values\HostOrderSource;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A host's claim takes every order waiting for it, signed, and an order once claimed is not handed out again at once.
 */
#[TestsCommand(ClaimHostOrdersCommand::class)]
final class ClaimHostOrdersTest extends TestCase
{
    use RefreshHookDatabase;

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

    public function test_a_claimed_input_order_whose_answer_never_came_is_handed_out_again(): void
    {
        $claimedAt = CarbonImmutable::parse('2026-11-26 10:00:00');
        $this->journal
            ->useServerClockAt($claimedAt)
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell', HostProcessType::Pipe);
        $hostId = $this->journal->hostCalled('Mac')->hostId;
        [$open] = $this->journal->hostOrdersOf('shell');
        $this->journal->answerHostOrder($open)->reportHostProcess('shell', HostProcessReportType::Running);
        $input = $this->journal->asSystem(new WriteHostInputCommand(
            $this->journal->hostProcessCalled('shell')->id,
            "hello\n",
            HostOrderSource::fromJournal(),
        ));
        $this->journal->asSystem(new ClaimHostOrdersCommand($hostId, 10));

        $soon = $this->journal->useServerClockAt($claimedAt->addSeconds(5))->asSystem(new ClaimHostOrdersCommand($hostId, 10));
        $later = $this->journal
            ->useServerClockAt($claimedAt->addSeconds(HostOrder::CLAIM_SECONDS + 1))
            ->asSystem(new ClaimHostOrdersCommand($hostId, 10));

        $this->journal->assertResult(
            [true, HostOrder::CLAIM_SECONDS - 5, [$input]],
            [
                $soon->isEmpty(),
                $soon->retakeableInSeconds,
                array_map(fn ($order) => $order->jsonSerialize()['id'], $later->orders),
            ],
        );
    }

    public function test_a_host_claims_none_of_another_hosts_orders(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->enrollHost('Other', [base_path()])->openHostProcess('Mac', 'shell');

        $claim = $this->journal->asSystem(new ClaimHostOrdersCommand($this->journal->hostCalled('Other')->hostId, 10));

        $this->journal->assertResult(true, $claim->isEmpty());
    }
}
