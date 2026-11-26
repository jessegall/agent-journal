<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Commands\Hosts\NotifyHostProcess\NotifyHostProcessCommand;
use App\Commands\Hosts\OpenHostProcess\OpenHostProcessCommand;
use App\Data\Hosts\HostProcessReportData;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessReportType;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Hosts\RestartPolicy;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Values\HostOrderSource;
use App\Values\HostProcessPlan;
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
        $this->hostProcesses[$name] = $this->asSystem(
            new OpenHostProcessCommand($this->hostCalled($host)->hostId, $runtimeId, $plan, HostOrderSource::fromJournal()),
        );

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
}
