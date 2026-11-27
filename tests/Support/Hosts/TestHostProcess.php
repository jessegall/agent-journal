<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Agents\Drivers\Work\DriverWork;
use App\Agents\Drivers\Work\DriverWorkers;
use App\Hosts\Commands\NotifyHostOutput\NotifyHostOutputCommand;
use App\Hosts\Commands\NotifyHostProcess\NotifyHostProcessCommand;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\ProcessFeed;
use App\Hosts\Protocol\Data\HostOutputData;
use App\Hosts\Protocol\Data\HostProcessReportData;
use App\Hosts\Protocol\HostProcessReportType;
use App\Models\Hosts\HostOrder;
use App\Terminals\PrivateValues;
use App\Values\HostOrderSource;
use App\Values\RowGuard;
use Closure;
use PHPUnit\Framework\Assert as PHPUnit;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Support\Assertions\Assert;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\TestJournal;

/**
 * A host process the test named, acted on as its host and the journal's driver worker act on it: reported, printed
 * on, typed into and driven. It keeps its own driver worker between calls, so no test holds one.
 */
final class TestHostProcess
{
    private DriverWork|null $work = null;

    public function __construct(private readonly TestJournal $journal, private readonly string $name) {}

    /**
     * The process's host reports it as the report type says, with the exit code given when it exited.
     */
    public function report(HostProcessReportType $report, int|null $exitCode = null): self
    {
        $process = $this->journal->hostProcessCalled($this->name);
        $this->journal->asSystem(new NotifyHostProcessCommand(
            $process->host_id,
            $process->id,
            HostProcessReportData::from([
                'process_id' => $process->id,
                'report' => $report,
                'identity' => "pid:{$this->name}",
                'generation' => 0,
                'exit_code' => $exitCode,
                'evidence' => $this->evidenceOf($report, $exitCode),
            ]),
        ));

        return $this;
    }

    /**
     * The evidence the host sends with a report that the process ended, as it says how; none for a running one.
     */
    private function evidenceOf(HostProcessReportType $report, int|null $exitCode): string|null
    {
        return match ($report) {
            HostProcessReportType::Exited => "the program exited with {$exitCode}",
            HostProcessReportType::Lost => 'the program was not found after the host restarted',
            HostProcessReportType::Running, HostProcessReportType::Restarted => null,
        };
    }

    /**
     * The process's host sends a frame whose first row reads as given.
     */
    public function print(string $firstRow): self
    {
        $process = $this->journal->hostProcessCalled($this->name);
        $frame = ['rows' => [$firstRow], 'cursor_row' => 0, 'cursor_column' => 0, 'columns' => 80, 'buffer' => 'normal',
            'captured' => 1];
        $body = HostOutputData::from(['frames' => [[...$frame, 'unchanged_ms' => [0]]], 'chunks' => []]);
        $this->journal->asSystem(new NotifyHostOutputCommand($process->host_id, $process->id, $body));

        return $this;
    }

    /**
     * The pipe process's host sends what it printed next on its standard output, right after what it sent before.
     */
    public function printOnPipe(string $printed): self
    {
        $process = $this->journal->hostProcessCalled($this->name);
        $chunk = ['stream' => 'stdout', 'offset' => $process->output_offset, 'bytes' => base64_encode($printed)];
        $body = HostOutputData::from(['frames' => [], 'chunks' => [$chunk]]);
        $this->journal->asSystem(new NotifyHostOutputCommand($process->host_id, $process->id, $body));

        return $this;
    }

    /**
     * The journal types the keys on the process, guarded by the screen its host last sent, as a key script does.
     */
    public function type(string $keys): self
    {
        $process = $this->journal->hostProcessCalled($this->name);
        $rows = $this->journal->service(ProcessFeed::class)->latestFrame($process->id)?->rows
            ?? throw FixtureRefused::missingAlias('screen of host process', $this->name, 'The journal');
        $guard = new RowGuard(0, count($rows) - 1, hash('sha256', implode("\n", $rows)));
        $this->journal->asSystem(new SendHostKeysCommand(
            $process->id,
            $keys,
            $guard,
            0,
            HostOrderSource::fromJournal(),
        ));

        return $this;
    }

    /**
     * A browser submitted the private value under the submission id, which now waits for the host to pull it.
     */
    public function submitPrivateValue(string $submissionId, string $value): self
    {
        $this->journal->service(PrivateValues::class)->keep($submissionId, $value);

        return $this;
    }

    /**
     * Waits up to the seconds for the process to reach the status, as its host reports it.
     */
    public function waitFor(HostProcessStatus $status, int $seconds = 30): self
    {
        $deadline = microtime(true) + $seconds;

        while ($this->journal->hostProcessCalled($this->name)->status !== $status && microtime(true) < $deadline) {
            usleep(100_000);
        }

        PHPUnit::assertSame(
            $status,
            $this->journal->hostProcessCalled($this->name)->status,
            $this->journal->processReport($this->name),
        );

        return $this;
    }

    /**
     * A new driver worker begins on the process in this test's process, in place of the one it kept.
     */
    public function beginWorker(): self
    {
        $this->work = $this->journal->service(DriverWorkers::class)->begin(
            $this->journal->hostProcessCalled($this->name)->id,
        );

        return $this;
    }

    /**
     * The kept worker, started when there is none, takes one step, waiting up to the milliseconds; a worker that ends is
     * let go, and the next drive begins another.
     */
    public function drive(int $waitMs = 200): self
    {
        $this->step($waitMs);

        return $this;
    }

    /**
     * The kept worker drives the process until the scope holds of the journal or the seconds pass; a scope that never
     * holds fails with the last assertion that missed and what the process got and showed.
     *
     * @param  Closure(Assert): mixed  $holds
     */
    public function driveUntil(Closure $holds, int $seconds = 30): self
    {
        $deadline = microtime(true) + $seconds;
        $miss = $this->missOf($holds);

        while ($miss !== null && microtime(true) < $deadline && $this->step(200)) {
            $miss = $this->missOf($holds);
        }

        $miss = $this->missOf($holds);

        if ($miss !== null) {
            PHPUnit::fail($miss->getMessage()."\n".$this->journal->processReport($this->name));
        }

        return $this;
    }

    /**
     * The process's oldest open order, handed to the scope to answer or refuse as its host.
     *
     * @param  Closure(TestHostOrder): mixed  $scope
     */
    public function order(Closure $scope): self
    {
        $open = HostOrder::findOpenOf($this->journal->hostProcessCalled($this->name)->id);
        $order = $open[0] ?? throw FixtureRefused::missingAlias(
            'open order of host process',
            $this->name,
            'The journal',
        );
        $this->journal->hostOrder($order, $scope);

        return $this;
    }

    /**
     * The assertion the scope missed, or none when it holds; a miss is the test's own failure, read to drive on.
     *
     * @param  Closure(Assert): mixed  $holds
     */
    private function missOf(Closure $holds): AssertionFailedError|null
    {
        try {
            $this->journal->assertJournal($holds);
        } catch (AssertionFailedError $miss) {
            return $miss;
        }

        return null;
    }

    /**
     * One step of the kept worker, started when there is none; answers whether the worker goes on.
     */
    private function step(int $waitMs): bool
    {
        if ($this->work === null) {
            $this->beginWorker();
        }

        $goesOn = $this->journal->service(DriverWorkers::class)->step($this->work, $waitMs);

        if (! $goesOn) {
            $this->work = null;
        }

        return $goesOn;
    }
}
