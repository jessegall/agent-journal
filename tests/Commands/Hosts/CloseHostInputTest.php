<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Exceptions\HostProtocolRefused;
use App\Exceptions\WorkerFenced;
use App\Hosts\Commands\CloseHostInput\CloseHostInputCommand;
use App\Hosts\Protocol\HostOrderType;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostProcessType;
use App\Values\HostOrderSource;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Closing a pipe process's input is one order with no payload; a replaced worker, an ended process and a terminal
 * process are refused.
 */
#[TestsCommand(CloseHostInputCommand::class)]
final class CloseHostInputTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac
                ->openProcess('shell')->openProcess('pipe', HostProcessType::Pipe));
    }

    public function test_it_orders_the_host_to_close_the_input(): void
    {
        $id = $this->journal->asSystem($this->command('pipe', HostOrderSource::fromJournal()));
        $order = $this->journal->hostOrdersOf('pipe')[1];

        $this->journal->assertResult(
            [$id, HostOrderType::CloseStdin, []],
            [$order->id, $order->type, $this->journal->payloadOf($order)],
        );
    }

    public function test_a_replaced_worker_is_fenced(): void
    {
        $this->journal->assertRefused(
            WorkerFenced::class,
            fn () => $this->journal->asSystem($this->command(
                'pipe',
                HostOrderSource::forStep('request-1', 'close', 0, 1),
            )),
        );
    }

    public function test_an_ended_or_a_terminal_process_takes_no_close(): void
    {
        $this->journal->hostProcess('pipe', fn (TestHostProcess $pipe) => $pipe
            ->report(HostProcessReportType::Exited, 0));

        foreach (['pipe', 'shell'] as $name) {
            $this->journal->assertRefused(
                HostProtocolRefused::class,
                fn () => $this->journal->asSystem($this->command($name, HostOrderSource::fromJournal())),
            );
        }
    }

    private function command(string $name, HostOrderSource $source): CloseHostInputCommand
    {
        return new CloseHostInputCommand($this->journal->hostProcessCalled($name)->id, $source);
    }
}
