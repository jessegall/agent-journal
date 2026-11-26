<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\WriteHostInput\WriteHostInputCommand;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessReportType;
use App\Enums\Hosts\HostProcessType;
use App\Exceptions\HostProtocolRefused;
use App\Exceptions\WorkerFenced;
use App\Values\HostOrderSource;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A stdin write carries its bytes; a replaced worker, an ended process and a terminal process are refused.
 */
#[TestsCommand(WriteHostInputCommand::class)]
final class WriteHostInputTest extends TestCase
{
    use RefreshHookDatabase;

    private const string NOW = '2026-11-26 10:00:00';

    private const array PAYLOAD = ['bytes' => 'aGk='];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal
            ->useServerClockAt(CarbonImmutable::parse(self::NOW))
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell')
            ->openHostProcess('Mac', 'pipe', HostProcessType::Pipe);
    }

    public function test_it_orders_the_host_with_its_payload_and_expiry(): void
    {
        $id = $this->journal->asSystem($this->command(HostOrderSource::fromJournal()));
        $order = $this->journal->hostOrdersOf('pipe')[1];

        $this->journal->assertResult(
            [$id, HostOrderType::WriteStdin, self::PAYLOAD, CarbonImmutable::parse(self::NOW)->addSeconds(30)->toIso8601String()],
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

        $orders = $this->journal->hostOrdersOf('pipe');

        $this->journal->assertResult([$first, 'request-1:step:0', 2], [$again, $orders[1]->idempotency_key, count($orders)]);
    }

    public function test_a_process_that_exited_takes_no_order(): void
    {
        $this->journal->reportHostProcess('pipe', HostProcessReportType::Exited, 0);

        $this->journal->assertRefused(
            HostProtocolRefused::class,
            fn () => $this->journal->asSystem($this->command(HostOrderSource::fromJournal())),
        );
    }

    public function test_a_terminal_process_takes_no_stdin(): void
    {
        $shell = $this->journal->hostProcessCalled('shell')->id;
        $write = new WriteHostInputCommand($shell, 'hi', HostOrderSource::fromJournal());

        $this->journal->assertRefused(HostProtocolRefused::class, fn () => $this->journal->asSystem($write));
    }

    private function command(HostOrderSource $source): WriteHostInputCommand
    {
        return new WriteHostInputCommand($this->journal->hostProcessCalled('pipe')->id, 'hi', $source);
    }
}
