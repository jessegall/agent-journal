<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Commands\Hosts\NotifyHostOrder\NotifyHostOrderCommand;
use App\Commands\Hosts\NotifyHostOutput\NotifyHostOutputCommand;
use App\Commands\Hosts\NotifyHostProcess\NotifyHostProcessCommand;
use App\Commands\Hosts\OpenHostProcess\OpenHostProcessCommand;
use App\Contracts\Drivers\ProgramDriver;
use App\Contracts\Hosts\HostChannel;
use App\Data\Hosts\HostProcessReportData;
use App\Enums\Agents\WorkspaceUse;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessReportType;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Hosts\RestartPolicy;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Support\ContainerManifest;
use App\Support\Drivers\DriverWork;
use App\Support\Drivers\DriverWorkers;
use App\Support\Drivers\ProgramDrivers;
use App\Support\Hosts\ProcessFeed;
use App\Support\MountRules;
use App\Support\SecurityOptions;
use App\Values\ExecutionBudgets;
use App\Values\HostOrderSource;
use App\Values\HostProcessPlan;
use Closure;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Process\Factory;
use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\Process;
use PHPUnit\Framework\Assert;
use Tests\Support\Hosts\RealHost;
use Tests\Support\Hosts\StandInHost;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * The processes a test's hosts run under protocol 1: opened through the real order, and moved by the reports their
 * host sends.
 */
trait ArrangesHostProcesses
{
    /**
     * @var array<string, string>
     */
    private array $hostProcesses = [];

    private RealHost|null $realHost = null;

    /**
     * The named host is ordered to open a native process of the type given, for the runtime given when it runs one;
     * the host has not reported it yet.
     */
    public function openHostProcess(
        string $host,
        string $name,
        HostProcessType $type = HostProcessType::Terminal,
        string|null $runtimeId = null,
    ): self {
        if (array_key_exists($name, $this->hostProcesses)) {
            throw FixtureRefused::occupiedAlias($name, 'host process');
        }

        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            $type,
            RestartPolicy::Never,
            ['sh', '-c', 'cat'],
            [],
            base_path(),
        );
        $this->openPlanned($host, $name, $runtimeId, $plan);

        return $this;
    }

    public function hostProcessCalled(string $name): HostProcess
    {
        $id = $this->hostProcesses[$name] ?? throw FixtureRefused::missingAlias('host process', $name, self::OWNER);

        return HostProcess::query()->whereKey($id)->sole();
    }

    /**
     * The process's host reports it as the report type says, with the exit code given when it exited.
     */
    public function reportHostProcess(string $name, HostProcessReportType $report, int|null $exitCode = null): self
    {
        $process = $this->hostProcessCalled($name);
        $this->asSystem(new NotifyHostProcessCommand(
            $process->host_id,
            $process->id,
            HostProcessReportData::from(['report' => $report, 'identity' => "pid:{$name}", 'exit_code' => $exitCode]),
        ));

        return $this;
    }

    /**
     * The orders made for the named process, oldest first.
     *
     * @return list<HostOrder>
     */
    public function hostOrdersOf(string $name): array
    {
        return HostOrder::findForProcess($this->hostProcessCalled($name)->id);
    }

    /**
     * Processes of the purpose are driven by the program driver given, as a domain that drives them registers it.
     *
     * @param  class-string<ProgramDriver>  $driver
     */
    public function driveProcessesWith(HostProcessPurpose $purpose, string $driver): self
    {
        $this->app->instance(ProgramDrivers::class, $this->app->make(ProgramDrivers::class)->with($purpose, $driver));

        return $this;
    }

    /**
     * The named process's host sends a frame whose first row reads as given.
     */
    public function printOnHostProcess(string $name, string $firstRow): self
    {
        $process = $this->hostProcessCalled($name);
        $frame = ['rows' => [$firstRow], 'cursor_row' => 0, 'cursor_column' => 0, 'columns' => 80, 'captured' => 1];
        $body = json_encode(['frames' => [[...$frame, 'unchanged_ms' => [0]]]], JSON_THROW_ON_ERROR);
        $this->asSystem(new NotifyHostOutputCommand($process->host_id, $process->id, $body));

        return $this;
    }

    /**
     * The order's host answers it as carried out.
     */
    public function answerHostOrder(HostOrder $order): self
    {
        $this->asSystem(new NotifyHostOrderCommand($order->host_id, $order->id, '{"status":"done"}'));

        return $this;
    }

    /**
     * Programs the journal starts run as fakes that end at once, so a test reads what was started.
     */
    public function fakeStartedPrograms(): self
    {
        Process::fake();

        return $this;
    }

    /**
     * @param  list<string>  $command
     */
    public function assertProgramStarted(array $command): self
    {
        Process::assertRan(fn (PendingProcess $process) => $process->command === $command);

        return $this;
    }

    /**
     * The host channel plays the committed recording in the folder, relative to the recordings of the Go host.
     */
    public function playsRecording(string $recording): self
    {
        $this->app->instance(
            HostChannel::class,
            StandInHost::playing(base_path("tools/journal-agent/testdata/recordings/{$recording}")),
        );

        return $this;
    }

    public function standInHost(): StandInHost
    {
        return $this->app->make(HostChannel::class);
    }

    /**
     * The named host runs for real: the host binary built from the checkout, against the Docker stand-in it carries
     * and the test application on a port of its own. The test commits its rows, so the served application sees them.
     */
    public function runRealHost(string $host): self
    {
        $database = (string) $this->app->make(Repository::class)->get('database.connections.pgsql.database');
        $this->realHost = RealHost::start($this->app->make(Factory::class), $this->hostCalled($host), $database);

        return $this;
    }

    /**
     * Opens a container of the stand-in's echo program on the named host, which must run for real.
     */
    public function openEchoContainer(
        string $host,
        string $name,
        string|null $runtimeId = null,
        RestartPolicy $restart = RestartPolicy::Never,
    ): self {
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Terminal,
            $restart,
            ['echo-program'],
            [],
            '/workspace',
            ContainerManifest::make(
                RealHost::IMAGE,
                '10001:10001',
                true,
                [],
                false,
                "journal-net-{$name}",
                [MountRules::local()->workspaceMount($this->realHostFolder(), WorkspaceUse::Shared)],
                [],
                ExecutionBudgets::defaults(),
                MountRules::local(),
                SecurityOptions::none(),
                true,
            ),
        );
        $this->openPlanned($host, $name, $runtimeId, $plan);

        return $this;
    }

    /**
     * Opens a local process of pipes on the named host, which must run for real, with the argv and the start
     * credentials of the runtime, handed over as the journal hands them to a process it orders opened.
     *
     * @param  list<string>  $argv
     */
    public function openWithStartCredentials(string $host, string $name, string $runtimeId, array $argv): self
    {
        $runtime = AgentRuntime::query()->whereKey($runtimeId)->sole();
        $credentials = $runtime->handOverStartCredentials($this->realHostJournalUrl());
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Pipe,
            RestartPolicy::Never,
            $argv,
            $credentials->environment(),
            base_path(),
        );
        $this->openPlanned($host, $name, $runtimeId, $plan);

        return $this;
    }

    /**
     * The journal the real host reaches goes away for the seconds and comes back, as after a crash of the app.
     */
    public function restartJournalOfRealHost(float $seconds = 1.0): self
    {
        $this->realHost?->restartJournal($seconds);

        return $this;
    }

    /**
     * A driver worker begins on the named process in this test's process. The worker service is taken anew for each
     * call, as the test's sync queue forgets scoped services after every job, which no real worker process runs.
     */
    public function beginDriverWorker(string $name): DriverWork
    {
        return $this->app->make(DriverWorkers::class)->begin($this->hostProcessCalled($name)->id);
    }

    /**
     * The worker takes its next step, waiting up to the milliseconds, and answers whether it goes on.
     */
    public function stepDriverWorker(DriverWork $work, int $waitMs): bool
    {
        return $this->app->make(DriverWorkers::class)->step($work, $waitMs);
    }

    /**
     * The real host, its Docker stand-in and its served journal stop, before the test's rows are emptied; nothing
     * happens when none runs.
     */
    public function stopRealHost(): self
    {
        $this->realHost?->stop();
        $this->realHost = null;

        return $this;
    }

    /**
     * The real host's binary stops and starts again, its containers left running.
     */
    public function restartRealHost(): self
    {
        $this->realHost?->restartHost();

        return $this;
    }

    /**
     * A driver worker drives the named process in this test's own process, step by step, until the condition holds
     * or the seconds pass, and answers the worker for further driving.
     *
     * @param  Closure(): bool  $until
     */
    public function driveHostProcess(
        string $name,
        Closure $until,
        DriverWork|null $work = null,
        int $seconds = 10,
    ): DriverWork {
        $work ??= $this->beginDriverWorker($name);
        $deadline = microtime(true) + $seconds;

        while (! $until() && microtime(true) < $deadline && $this->stepDriverWorker($work, 200)) {
            continue;
        }

        Assert::assertTrue($until(), $this->drivenSoFar($name));

        return $work;
    }

    /**
     * Waits up to the seconds for the named process to reach the status, as its host reports it.
     */
    public function waitForHostProcess(string $name, HostProcessStatus $status, int $seconds = 10): self
    {
        $deadline = microtime(true) + $seconds;

        while ($this->hostProcessCalled($name)->status !== $status && microtime(true) < $deadline) {
            usleep(100_000);
        }

        Assert::assertSame($status, $this->hostProcessCalled($name)->status, (string) $this->realHost?->printed());

        return $this;
    }

    /**
     * What a worker that did not get there saw: the process's last frame, its orders and what the real host printed.
     */
    private function drivenSoFar(string $name): string
    {
        $process = $this->hostProcessCalled($name);
        $rows = $this->app->make(ProcessFeed::class)->latestFrame($process->id)?->rows ?? [];
        $orders = array_map(
            fn (HostOrder $order) => "{$order->type->value} {$order->status->value} {$order->refusal?->value}",
            $this->hostOrdersOf($name),
        );

        return "The worker of {$name} did not reach what the test waits for.\n"
            .'Its process is '.$process->status->value.'; the last frame shows: '.implode(' | ', $rows)."\n"
            .'Its orders: '.implode(', ', $orders)."\n"
            .$this->realHost?->printed();
    }

    private function realHostJournalUrl(): string
    {
        $realHost = $this->realHost ?? throw FixtureRefused::missingAlias('real host', 'running', self::OWNER);

        return $realHost->journalUrl();
    }

    private function openPlanned(string $host, string $name, string|null $runtimeId, HostProcessPlan $plan): void
    {
        $hostId = $this->hostCalled($host)->hostId;
        $this->hostProcesses[$name] = $this->asSystem(
            new OpenHostProcessCommand($hostId, $runtimeId, $plan, HostOrderSource::fromJournal()),
        );
    }

    private function realHostFolder(): string
    {
        return $this->realHost?->folder ?? throw FixtureRefused::missingAlias('real host', 'running', self::OWNER);
    }
}
