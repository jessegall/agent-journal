<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Exceptions\HostProtocolRefused;
use App\Exceptions\WorkerFenced;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Enums\HostProcessReportType;
use App\Hosts\Enums\HostProcessType;
use App\Hosts\Protocol\HostOrderType;
use App\Values\HostOrderSource;
use App\Values\RowGuard;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A key write carries both guards and lapses after five seconds; a replaced worker, an ended process and a pipe process are refused.
 */
#[TestsCommand(SendHostKeysCommand::class)]
final class SendHostKeysTest extends TestCase
{
    use RefreshHookDatabase;

    private const string NOW = '2026-11-26 10:00:00';

    private const array PAYLOAD = [
        'bytes' => 'aGk=',
        'if_rows' => ['from' => 0, 'to' => 1, 'hash' => 'abc'],
        'if_input_generation' => 3,
        'as_user' => false,
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal
            ->useServerClockAt(CarbonImmutable::parse(self::NOW))
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'));
    }

    public function test_it_orders_the_host_with_its_payload_and_expiry(): void
    {
        $id = $this->journal->asSystem($this->command(HostOrderSource::fromJournal()));
        $order = $this->journal->hostOrdersOf('shell')[1];

        $this->journal->assertResult(
            [$id, HostOrderType::WriteKeys, self::PAYLOAD, CarbonImmutable::parse(self::NOW)->addSeconds(5)->toIso8601String()],
            [$order->id, $order->type, $this->journal->payloadOf($order), $order->expires_at->toIso8601String()],
        );
    }

    public function test_a_replaced_worker_is_fenced_and_a_repeated_step_makes_no_second_order(): void
    {
        $replaced = HostOrderSource::forStep('request-1', 'step', 0, 1);
        $current = HostOrderSource::forStep('request-1', 'step', 0, 0);

        $this->journal->assertRefused(
            WorkerFenced::class,
            fn () => $this->journal->asSystem($this->command($replaced)),
        );
        $first = $this->journal->asSystem($this->command($current));
        $again = $this->journal->asSystem($this->command($current));

        $orders = $this->journal->hostOrdersOf('shell');

        $this->journal->assertResult(
            [$first, 'request-1:step:0', 2],
            [$again, $orders[1]->idempotency_key, count($orders)],
        );
    }

    public function test_a_process_that_exited_takes_no_order(): void
    {
        $this->journal->hostProcess('shell', fn (TestHostProcess $shell) => $shell
            ->report(HostProcessReportType::Exited, 0));

        $this->journal->assertRefused(
            HostProtocolRefused::class,
            fn () => $this->journal->asSystem($this->command(HostOrderSource::fromJournal())),
        );
    }

    public function test_a_pipe_process_takes_no_keys(): void
    {
        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('pipe', HostProcessType::Pipe));
        $pipe = $this->journal->hostProcessCalled('pipe')->id;
        $keys = new SendHostKeysCommand($pipe, 'hi', new RowGuard(0, 1, 'abc'), 3, HostOrderSource::fromJournal());

        $this->journal->assertRefused(HostProtocolRefused::class, fn () => $this->journal->asSystem($keys));
    }

    private function command(HostOrderSource $source): SendHostKeysCommand
    {
        return new SendHostKeysCommand(
            $this->journal->hostProcessCalled('shell')->id,
            'hi',
            new RowGuard(0, 1, 'abc'),
            3,
            $source,
        );
    }
}
