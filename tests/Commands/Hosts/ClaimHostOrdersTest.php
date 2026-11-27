<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\ClaimHostOrders\ClaimHostOrdersCommand;
use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Commands\WriteHostInput\WriteHostInputCommand;
use App\Hosts\Enums\HostOrderStatus;
use App\Hosts\Enums\HostProcessReportType;
use App\Hosts\Enums\HostProcessType;
use App\Hosts\Values\ClaimedHostOrder;
use App\Hosts\Values\HostOrderClaim;
use App\Models\Hosts\HostOrder;
use App\Models\Projects\Host;
use App\Support\AgentImage;
use App\Values\HostOrderSource;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostOrder;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A host's claim takes every order waiting for it, signed, and an order once claimed is not handed out again at once;
 * the answer names the idle window the journal is configured with.
 */
#[TestsCommand(ClaimHostOrdersCommand::class)]
final class ClaimHostOrdersTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_every_waiting_order_is_claimed_signed_and_not_handed_out_twice(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('second')->openProcess('first'));
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
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell', HostProcessType::Pipe));
        $hostId = $this->journal->hostCalled('Mac')->hostId;
        [$open] = $this->journal->hostOrdersOf('shell');
        $this->journal->hostOrder($open, fn (TestHostOrder $order) => $order
            ->answer())->hostProcess('shell', fn (TestHostProcess $shell) => $shell
            ->report(HostProcessReportType::Running));
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
        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->enrollHost('Other', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac
                ->openProcess('shell'));

        $claim = $this->journal->asSystem(new ClaimHostOrdersCommand($this->journal->hostCalled('Other')->hostId, 10));

        $this->journal->assertResult(true, $claim->isEmpty());
    }

    public function test_the_answer_names_the_configured_idle_window(): void
    {
        config(['agents.idle_window_seconds' => 42]);
        $this->journal->enrollHost('Mac', [base_path()]);

        $claim = $this->journal->asSystem(new ClaimHostOrdersCommand($this->journal->hostCalled('Mac')->hostId, 10));

        $this->journal->assertResult(42, $claim->jsonSerialize()['idle_window_s']);
    }

    public function test_a_contained_host_is_ordered_the_agent_image_once_and_again_after_its_restart(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;
        $inventory = json_encode([
            'protocol' => 1,
            'release' => '6.0.0',
            'answered_through' => null,
            'processes' => [],
        ], JSON_THROW_ON_ERROR);

        $first = $this->journal->asSystem(new ClaimHostOrdersCommand($hostId, 10));
        $second = $this->journal->asSystem(new ClaimHostOrdersCommand($hostId, 10));
        $this->journal->asSystem(new NotifyHostInventoryCommand($hostId, $inventory));
        $afterRestart = $this->journal->asSystem(new ClaimHostOrdersCommand($hostId, 10));

        $typesOf = fn (HostOrderClaim $claim) => array_map(
            fn (ClaimedHostOrder $order) => $order->type,
            $claim->orders,
        );
        $image = $this->journal->service(AgentImage::class)->reference;
        $this->journal->assertResult(
            [['allow_images'], [], ['allow_images'], ['images' => [$image]]],
            [
                $typesOf($first),
                $typesOf($second),
                $typesOf($afterRestart),
                $this->journal->payloadOf($this->journal->hostOrdersOn('Box')[0]),
            ],
        );
    }
}
