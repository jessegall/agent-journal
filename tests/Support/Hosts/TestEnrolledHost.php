<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Agents\ContainerManifest;
use App\Agents\Enums\WorkspaceUse;
use App\Agents\SecurityOptions;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostProcessType;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Support\MountRules;
use App\Values\ExecutionBudgets;
use App\Values\HostInstructionSource;
use App\Values\HostProcessPlan;
use Closure;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\TestJournal;

/**
 * A host the test enrolled that runs no binary: the journal instructs it to open processes, which the test then reports
 * on as the host would.
 */
final readonly class TestEnrolledHost
{
    public function __construct(private TestJournal $journal, private string $name) {}

    /**
     * The host is ordered to open a native process of the type and purpose given, for the runtime given when it runs
     * one; the host has not reported it yet.
     */
    public function openProcess(
        string $name,
        HostProcessType $type = HostProcessType::Terminal,
        string|null $runtimeId = null,
        HostProcessPurpose $purpose = HostProcessPurpose::Probe,
    ): self {
        $plan = new HostProcessPlan(
            $purpose,
            $type,
            RestartPolicy::Never,
            ['sh', '-c', 'cat'],
            [],
            base_path(),
        );
        $this->journal->openPlannedProcess($this->name, $name, $plan, $runtimeId);

        return $this;
    }

    /**
     * The host is ordered to open a container of the test host's echo image on a workspace, its program given the
     * environment; the host has not reported it yet.
     *
     * @param  list<string>  $environment  each variable as NAME=value
     */
    public function openContainer(string $name, array $environment = []): self
    {
        $manifest = ContainerManifest::make(
            TestHost::IMAGE,
            "journal-net-{$name}",
            [MountRules::local()->workspaceMount(base_path('storage/framework'), WorkspaceUse::Shared, $name)],
            ExecutionBudgets::defaults(),
            MountRules::local(),
            SecurityOptions::none(),
            true,
        );
        $plan = new HostProcessPlan(
            HostProcessPurpose::Probe,
            HostProcessType::Terminal,
            RestartPolicy::Never,
            ['claude'],
            $environment,
            '/workspace',
            $manifest,
        );
        $this->journal->openPlannedProcess($this->name, $name, $plan);

        return $this;
    }

    /**
     * The session's start is taken, by this host or, for a driver the journal drives, by the journal already, and the
     * host is ordered to open a process of the purpose for it, which has not reported yet.
     */
    public function openProcessForStart(
        string $name,
        string $sessionId,
        HostProcessPurpose $purpose = HostProcessPurpose::AgentTerminal,
    ): self {
        $hostId = $this->journal->hostCalled($this->name)->hostId;
        $start = SessionProcess::findCurrentOf($sessionId)
            ?? throw FixtureRefused::missingAlias('start', $sessionId, 'The journal');
        $this->journal->claimStartOf($hostId, $sessionId);
        $plan = new HostProcessPlan(
            $purpose,
            HostProcessType::Terminal,
            RestartPolicy::Never,
            ['sh', '-c', 'cat'],
            [],
            base_path(),
        );
        $runtimeId = AgentRuntime::findForSession($sessionId)?->id;
        $command = new OpenHostProcessCommand($hostId, $runtimeId, $plan, HostInstructionSource::fromJournal(), $start->id);
        $this->journal->nameHostProcess($name, $this->journal->asSystem($command));

        return $this;
    }

    /**
     * A process of this host the test named, handed to the scope.
     *
     * @param  Closure(TestHostProcess): mixed  $scope
     */
    public function process(string $name, Closure $scope): self
    {
        $this->journal->hostProcess($name, $scope);

        return $this;
    }

    /**
     * The journal answered one of the host's calls just now, as it does for a live host.
     */
    public function markAnswered(): self
    {
        $this->journal->markHostAnswered($this->journal->hostCalled($this->name));

        return $this;
    }
}
