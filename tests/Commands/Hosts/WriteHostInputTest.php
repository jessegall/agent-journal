<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Exceptions\HostProtocolRefused;
use App\Exceptions\WorkerFenced;
use App\Hosts\Commands\WriteHostInput\WriteHostInputCommand;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostProcessType;
use App\Values\HostInstructionSource;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostProcess;
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
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac
                ->openProcess('shell')->openProcess('pipe', HostProcessType::Pipe));
    }

    public function test_it_instructs_the_host_with_its_payload_and_expiry(): void
    {
        $id = $this->journal->asSystem($this->command(HostInstructionSource::fromJournal()));
        $instruction = $this->journal->hostInstructionsOf('pipe')[1];

        $this->journal->assertResult(
            [$id, HostInstructionType::WriteStdin, self::PAYLOAD, CarbonImmutable::parse(self::NOW)->addSeconds(30)->toIso8601String()],
            [$instruction->id, $instruction->type, $this->journal->payloadOf($instruction), $instruction->expires_at->toIso8601String()],
        );
    }

    public function test_a_replaced_worker_is_fenced_and_a_repeated_step_makes_no_second_instruction(): void
    {
        $replaced = HostInstructionSource::forStep('request-1', 'step', 0, 1);
        $current = HostInstructionSource::forStep('request-1', 'step', 0, 0);

        $this->journal->assertRefused(
            WorkerFenced::class,
            fn () => $this->journal->asSystem($this->command($replaced)),
        );
        $first = $this->journal->asSystem($this->command($current));
        $again = $this->journal->asSystem($this->command($current));

        $instructions = $this->journal->hostInstructionsOf('pipe');

        $this->journal->assertResult(
            [$first, 'request-1:step:0', 2],
            [$again, $instructions[1]->idempotency_key, count($instructions)],
        );
    }

    public function test_a_process_that_exited_takes_no_instruction(): void
    {
        $this->journal->hostProcess('pipe', fn (TestHostProcess $pipe) => $pipe
            ->report(HostProcessReportType::Exited, 0));

        $this->journal->assertRefused(
            HostProtocolRefused::class,
            fn () => $this->journal->asSystem($this->command(HostInstructionSource::fromJournal())),
        );
    }

    public function test_a_terminal_process_takes_no_stdin(): void
    {
        $shell = $this->journal->hostProcessCalled('shell')->id;
        $write = new WriteHostInputCommand($shell, 'hi', HostInstructionSource::fromJournal());

        $this->journal->assertRefused(HostProtocolRefused::class, fn () => $this->journal->asSystem($write));
    }

    private function command(HostInstructionSource $source): WriteHostInputCommand
    {
        return new WriteHostInputCommand($this->journal->hostProcessCalled('pipe')->id, 'hi', $source);
    }
}
