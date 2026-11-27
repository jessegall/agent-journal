<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessType;
use App\Hosts\Enums\RestartPolicy;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Values\HostOrderSource;
use App\Values\HostProcessPlan;
use Closure;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\TestJournal;

/**
 * A host the test enrolled that runs no binary: the journal orders it to open processes, which the test then reports
 * on as the host would.
 */
final readonly class TestEnrolledHost
{
    public function __construct(private TestJournal $journal, private string $name) {}

    /**
     * The host is ordered to open a native process of the type given, for the runtime given when it runs one; the
     * host has not reported it yet.
     */
    public function openProcess(
        string $name,
        HostProcessType $type = HostProcessType::Terminal,
        string|null $runtimeId = null,
    ): self {
        $plan = new HostProcessPlan(HostProcessPurpose::Probe, $type, RestartPolicy::Never, ['sh', '-c', 'cat'], [], base_path());
        $this->journal->openPlannedProcess($this->name, $name, $plan, $runtimeId);

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
        $plan = new HostProcessPlan($purpose, HostProcessType::Terminal, RestartPolicy::Never, ['sh', '-c', 'cat'], [], base_path());
        $runtimeId = AgentRuntime::findForSession($sessionId)?->id;
        $command = new OpenHostProcessCommand($hostId, $runtimeId, $plan, HostOrderSource::fromJournal(), $start->id);
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
