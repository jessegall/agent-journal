<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Contracts\Time\ServerClock;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Models\Hosts\HostOrder;
use App\Support\Drivers\DriverRestartSignal;
use App\Support\Drivers\DriverWorkers;
use Tests\Support\Drivers\StandInProcessDriver;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A worker drives its process from what arrives on its feed: output, an answer to one of its orders and its runtime's
 * requests, each without polling; a replaced worker is fenced and ends, and a restart ends a worker between steps.
 */
#[TestsMachinery(DriverWorkers::class)]
final class DriverWorkersTest extends TestCase
{
    use RefreshHookDatabase;

    private const int WAIT_MS = 200;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, StandInProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell');
    }

    public function test_a_replaced_worker_is_fenced_and_the_one_after_it_pastes_no_second_time(): void
    {
        $first = $this->journal->beginDriverWorker('shell');
        $this->journal->printOnHostProcess('shell', '> ');
        $firstGoesOn = $this->journal->stepDriverWorker($first, self::WAIT_MS);

        $second = $this->journal->beginDriverWorker('shell');
        $this->journal->printOnHostProcess('shell', '> ');
        $replacedGoesOn = $this->journal->stepDriverWorker($first, self::WAIT_MS);
        $secondGoesOn = $this->journal->stepDriverWorker($second, self::WAIT_MS);

        $this->journal->assertResult(
            [true, false, true, 1],
            [$firstGoesOn, $replacedGoesOn, $secondGoesOn, $this->ordersOf(HostOrderType::WriteKeys)],
        );
    }

    public function test_an_answer_to_its_order_wakes_the_worker(): void
    {
        $work = $this->journal->beginDriverWorker('shell');
        [, $snapshot, $stream] = $this->journal->hostOrdersOf('shell');

        $this->journal->answerHostOrder($snapshot);
        $this->journal->stepDriverWorker($work, self::WAIT_MS);

        $this->journal->assertResult(
            [['frames_per_second' => 4, 'raw' => false], ['signal' => 'SIGUSR2']],
            [$this->journal->payloadOf($stream), $this->journal->payloadOf($this->lastOrder())],
        );
    }

    public function test_a_restart_ends_the_worker_between_steps(): void
    {
        $work = $this->journal->beginDriverWorker('shell');

        $this->journal->service(DriverRestartSignal::class)->ask($this->journal->service(ServerClock::class)->now());

        $this->journal->assertResult(false, $this->journal->stepDriverWorker($work, self::WAIT_MS));
    }

    private function ordersOf(HostOrderType $type): int
    {
        return count(array_filter($this->journal->hostOrdersOf('shell'), fn (HostOrder $order) => $order->type === $type));
    }

    private function lastOrder(): HostOrder
    {
        $orders = $this->journal->hostOrdersOf('shell');

        return $orders[array_key_last($orders)];
    }
}
