<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Agents\Drivers\Work\DriverRestartSignal;
use App\Agents\Drivers\Work\DriverWorkers;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Protocol\HostInstructionType;
use App\Models\Hosts\HostInstruction;
use App\Time\Contracts\ServerClock;
use Tests\Support\Drivers\MockProcessDriver;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A worker drives its process from what arrives on its feed: output, an answer to one of its instructions and its runtime's
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
            ->driveProcessesWith(HostProcessPurpose::Probe, MockProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'));
    }

    public function test_a_replaced_worker_is_fenced_and_the_one_after_it_pastes_no_second_time(): void
    {
        $first = $this->journal->service(DriverWorkers::class)->begin($this->journal->hostProcessCalled('shell')->id);
        $this->journal->hostProcess('shell', fn (TestHostProcess $shell) => $shell->print('> '));
        $firstGoesOn = $this->journal->service(DriverWorkers::class)->step($first, self::WAIT_MS);

        $second = $this->journal->service(DriverWorkers::class)->begin($this->journal->hostProcessCalled('shell')->id);
        $this->journal->hostProcess('shell', fn (TestHostProcess $shell) => $shell->print('> '));
        $replacedGoesOn = $this->journal->service(DriverWorkers::class)->step($first, self::WAIT_MS);
        $secondGoesOn = $this->journal->service(DriverWorkers::class)->step($second, self::WAIT_MS);

        $this->journal->assertResult(
            [true, false, true, 1],
            [$firstGoesOn, $replacedGoesOn, $secondGoesOn, $this->instructionsOf(HostInstructionType::WriteKeys)],
        );
    }

    public function test_an_answer_to_its_instruction_wakes_the_worker(): void
    {
        $work = $this->journal->service(DriverWorkers::class)->begin($this->journal->hostProcessCalled('shell')->id);
        [, $snapshot, $stream] = $this->journal->hostInstructionsOf('shell');

        $this->journal->hostInstruction($snapshot, fn (TestHostInstruction $instruction) => $instruction->answer());
        $this->journal->service(DriverWorkers::class)->step($work, self::WAIT_MS);

        $this->journal->assertResult(
            [[
                'frames_per_second' => 4,
                'raw' => false,
            ], ['signal' => 'SIGUSR2']],
            [$this->journal->payloadOf($stream), $this->journal->payloadOf($this->lastInstruction())],
        );
    }

    public function test_a_restart_ends_the_worker_between_steps(): void
    {
        $work = $this->journal->service(DriverWorkers::class)->begin($this->journal->hostProcessCalled('shell')->id);

        $this->journal->service(DriverRestartSignal::class)->ask($this->journal->service(ServerClock::class)->now());

        $this->journal->assertResult(false, $this->journal->service(DriverWorkers::class)->step($work, self::WAIT_MS));
    }

    private function instructionsOf(HostInstructionType $type): int
    {
        return count(array_filter($this->journal->hostInstructionsOf('shell'), fn (HostInstruction $instruction) => $instruction
            ->type === $type));
    }

    private function lastInstruction(): HostInstruction
    {
        $instructions = $this->journal->hostInstructionsOf('shell');

        return $instructions[array_key_last($instructions)];
    }
}
