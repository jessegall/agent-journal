<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\CloseHostInput\CloseHostInputCommand;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessReportType;
use App\Enums\Hosts\HostProcessType;
use App\Exceptions\HostProtocolRefused;
use App\Exceptions\WorkerFenced;
use App\Values\HostOrderSource;
use Tests\Support\Entries\Attributes\TestsCommand;
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
            ->openHostProcess('Mac', 'shell')
            ->openHostProcess('Mac', 'pipe', HostProcessType::Pipe);
    }

    public function test_it_orders_the_host_to_close_the_input(): void
    {
        $id = $this->journal->asSystem($this->command('pipe', HostOrderSource::fromJournal()));
        $order = $this->journal->hostOrdersOf('pipe')[1];

        $this->journal->assertResult([$id, HostOrderType::CloseStdin, []], [$order->id, $order->type, $this->journal->payloadOf($order)]);
    }

    public function test_a_replaced_worker_is_fenced(): void
    {
        $this->journal->assertRefused(
            WorkerFenced::class,
            fn () => $this->journal->asSystem($this->command('pipe', HostOrderSource::forStep('request-1', 'close', 0, 1))),
        );
    }

    public function test_an_ended_or_a_terminal_process_takes_no_close(): void
    {
        $this->journal->reportHostProcess('pipe', HostProcessReportType::Exited, 0);

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
