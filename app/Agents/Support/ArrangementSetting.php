<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ArrangementType;
use App\Agents\Exceptions\AccountFolderInvalid;
use App\Agents\Exceptions\ArrangementUnknown;
use App\Agents\Exceptions\DriverNotContainable;
use App\Agents\Exceptions\HostArrangementRefused;
use App\Agents\Exceptions\InstallationNameMissing;
use App\Agents\Exceptions\RunnerArrangementRefused;
use App\Agents\Exceptions\WorkspaceSourceMissing;
use App\Agents\Exceptions\WorkspaceSourcesInvalid;
use App\Agents\Models\Host;
use App\Agents\Values\SelectedAccount;
use App\Drivers\Values\OperationSupport;

/**
 * The arrangement this journal runs its agents in, read once from AGENTS_ARRANGEMENT; the one place that answers it,
 * so no code reads the setting itself.
 */
final readonly class ArrangementSetting
{
    /**
     * The one environment version 6 runs per installation, whose workspace source a contained start mounts; the
     * skill conditions read the same name.
     */
    public const string ENVIRONMENT = 'main';

    private function __construct(
        public ArrangementType $arrangement,
        private string $installationName,
        private WorkspaceSources $workspaceSources,
    ) {}

    /**
     * @throws ArrangementUnknown
     * @throws InstallationNameMissing
     * @throws WorkspaceSourcesInvalid
     */
    public static function fromConfig(string $value, string $installationName, string $workspaces): self
    {
        $arrangement = ArrangementType::tryFrom($value) ?? throw ArrangementUnknown::for($value);

        if ($arrangement->isContained() && $installationName === '') {
            throw InstallationNameMissing::whenContained();
        }

        return new self($arrangement, $installationName, WorkspaceSources::fromJson($workspaces, $installationName));
    }

    /**
     * The mounts a helper container may have here; contained, its workspace is its environment's declared source and
     * the one account folder it may mount is the session's own, when it has an account. A contained start for an
     * environment without a source is refused before any container exists.
     *
     * @throws WorkspaceSourceMissing
     * @throws AccountFolderInvalid
     */
    public function mountRules(SelectedAccount|null $account, string $environment): MountRules
    {
        if (! $this->arrangement->isContained()) {
            return MountRules::local();
        }

        return MountRules::contained(
            $this->installationName,
            $account === null ? null : MountRules::accountFolder($account->folder()),
            $this->workspaceSources->for($environment),
        );
    }

    /**
     * The name a contained session's container and its own network share on the agent daemon: the installation name
     * and the session, so the host's sweep tells this installation's sessions apart (task 1472).
     */
    public function sessionContainerName(string $sessionId): string
    {
        return "{$this->installationName}-{$sessionId}";
    }

    /**
     * @throws HostArrangementRefused
     */
    public function assertFits(Host $host): void
    {
        if ($host->arrangement === $this->arrangement || $host->isConnectedFolderRelay()) {
            return;
        }

        throw $this->arrangement->isContained()
            ? HostArrangementRefused::localHost()
            : HostArrangementRefused::containedHost();
    }

    /**
     * Refuses, contained, a driver whose capabilities say it cannot run in a container, with their reason.
     *
     * @throws DriverNotContainable
     */
    public function assertContainable(OperationSupport $runContained): void
    {
        if ($this->arrangement->isContained() && ! $runContained->isAllowed()) {
            throw DriverNotContainable::because((string) $runContained->reason);
        }
    }

    /**
     * Refuses a sign-in runner of the other arrangement.
     *
     * @throws RunnerArrangementRefused
     */
    public function assertRunnerFits(ArrangementType $runner): void
    {
        if ($runner !== $this->arrangement) {
            throw RunnerArrangementRefused::between($this->arrangement, $runner);
        }
    }
}
