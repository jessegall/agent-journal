<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Files\ManifestMount;
use App\Hosts\Exceptions\AccountFolderInvalid;
use App\Hosts\Exceptions\ArrangementUnknown;
use App\Hosts\Exceptions\DriverNotContainable;
use App\Hosts\Exceptions\InstallationNameMissing;
use App\Hosts\Exceptions\RunnerArrangementRefused;
use App\Hosts\Exceptions\WorkspaceSourceMissing;
use App\Hosts\Exceptions\WorkspaceSourcesInvalid;
use App\Hosts\Protocol\Payloads\HostContainerLabelPayload;
use App\Models\Projects\Host;
use App\Projects\Enums\ArrangementType;
use App\Projects\Exceptions\HostArrangementRefused;
use App\Support\MountRules;
use App\Values\OperationSupport;
use App\Values\SelectedAccount;

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
     *
     * @param  list<ManifestMount>  $driverMounts  the mounts the session's driver adds
     *
     * @throws WorkspaceSourceMissing
     * @throws AccountFolderInvalid
     */
    public function mountRules(SelectedAccount|null $account, string $environment, array $driverMounts): MountRules
    {
        if (! $this->arrangement->isContained()) {
            return MountRules::local();
        }

        return MountRules::contained(
            $this->installationName,
            $account === null ? null : MountRules::accountFolder($account->folder()),
            $this->workspaceSources->for($environment),
            $driverMounts,
        );
    }

    /**
     * The name a contained session's container and its own network share on the agent daemon: the installation name
     * and the session, so the host's sweep tells this installation's sessions apart.
     */
    public function sessionContainerName(string $sessionId): string
    {
        return "{$this->installationName}-{$sessionId}";
    }

    /**
     * The labels of a contained session's container: the session and its account's folder; the host adds its own.
     *
     * @return list<HostContainerLabelPayload>
     */
    public function labelsFor(string $sessionId, SelectedAccount $account): array
    {
        return [
            HostContainerLabelPayload::from(['name' => ContainerLabels::SESSION, 'value' => $sessionId]),
            HostContainerLabelPayload::from(['name' => ContainerLabels::ACCOUNT, 'value' => $account->folder()]),
        ];
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
