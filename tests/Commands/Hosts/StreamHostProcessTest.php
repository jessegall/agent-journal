<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\StreamHostProcess\StreamHostProcessCommand;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessReportType;
use App\Exceptions\HostProtocolRefused;
use App\Exceptions\WorkerFenced;
use App\Values\HostOrderSource;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A stream order carries its rate; a replaced worker and an ended process are refused.
 */
#[TestsCommand(StreamHostProcessCommand::class)]
final class StreamHostProcessTest extends TestCase
{
    use RefreshHookDatabase;

    private const string NOW = '2026-11-26 10:00:00';

    private const array PAYLOAD = ['frames_per_second' => 4, 'raw' => false];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal
            ->useServerClockAt(CarbonImmutable::parse(self::NOW))
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell');
    }

    public function test_it_orders_the_host_with_its_payload_and_expiry(): void
    {
        $id = $this->journal->asSystem($this->command(HostOrderSource::fromJournal()));
        $order = $this->journal->hostOrdersOf('shell')[1];

        $this->journal->assertResult(
            [$id, HostOrderType::Stream, self::PAYLOAD, CarbonImmutable::parse(self::NOW)->addSeconds(30)->toIso8601String()],
            [$order->id, $order->type, $order->payload, $order->expires_at->toIso8601String()],
        );
    }

    public function test_a_replaced_worker_is_fenced_and_a_repeated_step_makes_no_second_order(): void
    {
        $replaced = HostOrderSource::forStep('request-1', 'step', 0, 1);
        $current = HostOrderSource::forStep('request-1', 'step', 0, 0);

        $this->journal->assertRefused(WorkerFenced::class, fn () => $this->journal->asSystem($this->command($replaced)));
        $first = $this->journal->asSystem($this->command($current));
        $again = $this->journal->asSystem($this->command($current));

        $orders = $this->journal->hostOrdersOf('shell');

        $this->journal->assertResult([$first, 'request-1:step:0', 2], [$again, $orders[1]->idempotency_key, count($orders)]);
    }

    public function test_a_process_that_exited_takes_no_order(): void
    {
        $this->journal->reportHostProcess('shell', HostProcessReportType::Exited, 0);

        $this->journal->assertRefused(
            HostProtocolRefused::class,
            fn () => $this->journal->asSystem($this->command(HostOrderSource::fromJournal())),
        );
    }

    private function command(HostOrderSource $source): StreamHostProcessCommand
    {
        return new StreamHostProcessCommand($this->journal->hostProcessCalled('shell')->id, 4, false, $source);
    }
}
