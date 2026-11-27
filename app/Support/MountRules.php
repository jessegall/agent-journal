<?php

declare(strict_types=1);

namespace App\Support;

use App\Agents\ContainerManifest;
use App\Agents\Enums\WorkspaceUse;
use App\Agents\Exceptions\ManifestRefused;
use App\Files\Contracts\WorkspaceSource;
use App\Files\ManifestMount;
use App\Hosts\ContainerLabels;
use App\Hosts\Protocol\HostMountType;
use App\Hosts\Protocol\Payloads\HostContainerLabelPayload;
use App\Hosts\Protocol\Payloads\HostContainerVolumePayload;

/**
 * Which mounts a helper container may have: in the local arrangement exactly one folder of this machine at
 * /workspace; contained, one to four mounts of the agent daemon on their own folders, volumes of this installation
 * and folders under /srv/journal/, an account folder only the session's own.
 */
final readonly class MountRules
{
    /**
     * The agent daemon's folder every daemon bind comes from, the one the host is installed with.
     */
    public const string DATA_FOLDER = '/srv/journal';

    public const string ACCOUNTS_ROOT = self::DATA_FOLDER.'/accounts';

    /**
     * Where each process's plan files are written on the agent daemon, one folder to a session.
     */
    public const string SESSIONS_ROOT = self::DATA_FOLDER.'/sessions';

    private const int MOST_CONTAINED_MOUNTS = 5;

    /**
     * Where a contained session finds its account's own folder.
     */
    public const string ACCOUNT_TARGET = '/home/journal/.account';

    private const string PROJECTS_TARGET = self::ACCOUNT_TARGET.'/projects';

    /**
     * Where a contained session finds its plan's files, such as its skills, read-only; under /tmp, the one folder
     * outside the workspace its driver's file tools may read.
     */
    public const string SESSION_TARGET = '/tmp/journal-session';

    private const array CONTAINED_TARGETS = [
        '/workspace',
        self::ACCOUNT_TARGET,
        self::PROJECTS_TARGET,
        self::SESSION_TARGET,
    ];

    /**
     * Host folders that hold accounts, credentials or host control; no local mount may name them.
     */
    private const array PROTECTED_SOURCES = [
        '/var/run/docker.sock',
        '/run/docker.sock',
        '/.ssh',
        '/.claude',
        '/.codex',
        '/.config',
        '/Library/Keychains',
        '/etc',
    ];

    /**
     * @param  list<ManifestMount>  $driverMounts  the mounts the session's driver adds: plan files, scratch
     */
    private function __construct(
        public string|null $installationName,
        public string|null $accountSource,
        public WorkspaceSource|null $workspaceSource,
        private array $driverMounts,
    ) {}

    public static function local(): self
    {
        return new self(null, null, null, []);
    }

    /**
     * The rules of a contained session: its volumes open with the installation name, its workspace comes from its
     * environment's declared source, and the one account folder it may mount, when it has an account, is its own.
     */
    /**
     * @param  list<ManifestMount>  $driverMounts
     */
    public static function contained(
        string $installationName,
        string|null $accountSource,
        WorkspaceSource $workspaceSource,
        array $driverMounts,
    ): self {
        return new self($installationName, $accountSource, $workspaceSource, $driverMounts);
    }

    /**
     * The mount that puts the start's workspace at /workspace: locally the start's own folder on this machine;
     * contained, its environment's volume or server folder, which the host fills or checks before the container, or
     * for a writing helper its own clone of it.
     */
    public function workspaceMount(string $localFolder, WorkspaceUse $use, string $sessionId): ManifestMount
    {
        if ($this->workspaceSource === null) {
            return ManifestMount::bind($localFolder, ContainerManifest::WORKDIR, $use->isWritable());
        }

        if ($use->isOwnCheckout()) {
            return ManifestMount::volume($this->checkoutVolume($sessionId), ContainerManifest::WORKDIR, true);
        }

        return $this->workspaceSource->mount($use->isWritable());
    }

    /**
     * Whether the mounts bind an account folder at the account home.
     *
     * @param  list<ManifestMount>  $mounts
     */
    public function bindsAccount(array $mounts): bool
    {
        return array_any($mounts, fn (ManifestMount $mount) => $mount->target === self::ACCOUNT_TARGET);
    }

    /**
     * A contained session's own account folder, bound read-write at the account home so the driver can refresh its
     * sign-in; none locally or without an account.
     *
     * @return list<ManifestMount>
     */
    public function accountMounts(): array
    {
        if ($this->installationName === null || $this->accountSource === null) {
            return [];
        }

        return [ManifestMount::daemonBind($this->accountSource, self::ACCOUNT_TARGET, true)];
    }

    /**
     * The daemon path of an account's own folder under the accounts root.
     */
    public static function accountFolder(string $folder): string
    {
        return self::ACCOUNTS_ROOT.'/'.$folder;
    }

    /**
     * The mounts a contained session has beside its workspace: its own history volume over the account's projects
     * folder, which a resumed conversation takes from the session that held it, and its plan's files read-only, with
     * the mounts its driver adds. A local session has none.
     *
     * @return list<ManifestMount>
     */
    public function sessionMounts(string $sessionId, string|null $resumedSessionId): array
    {
        if ($this->installationName === null) {
            return [];
        }

        return [
            ManifestMount::volume($this->historyVolume($sessionId, $resumedSessionId), self::PROJECTS_TARGET, true),
            ManifestMount::planFiles(self::SESSION_TARGET),
            ...$this->driverMounts,
        ];
    }

    /**
     * The volumes a contained session's container needs made first: its history, which a resumed conversation takes
     * from the session that held it and must find, and a writer's own checkout, bounded in size. None locally.
     *
     * @return list<HostContainerVolumePayload>
     */
    public function sessionVolumes(
        string $sessionId,
        string|null $resumedSessionId,
        WorkspaceUse $use,
        int $workspaceBytes,
    ): array {
        if ($this->installationName === null) {
            return [];
        }

        $labels = [HostContainerLabelPayload::from(['name' => ContainerLabels::SESSION, 'value' => $sessionId])];
        $volumes = [HostContainerVolumePayload::from([
            'name' => $this->historyVolume($sessionId, $resumedSessionId),
            'labels' => $labels,
            'sizeBytes' => 0,
            'mustExist' => $resumedSessionId !== null,
        ])];

        if ($use->isOwnCheckout()) {
            $volumes[] = HostContainerVolumePayload::from([
                'name' => $this->checkoutVolume($sessionId),
                'labels' => $labels,
                'sizeBytes' => $workspaceBytes,
                'mustExist' => false,
            ]);
        }

        return $volumes;
    }

    /**
     * The history volume a session's container mounts: its own, or the one of the session whose conversation it
     * resumes.
     */
    private function historyVolume(string $sessionId, string|null $resumedSessionId): string
    {
        return "{$this->installationName}-history-".($resumedSessionId ?? $sessionId);
    }

    /**
     * A writer session's own checkout volume, which its container mounts as its workspace.
     */
    public function checkoutVolume(string $sessionId): string
    {
        return "{$this->installationName}-checkout-{$sessionId}";
    }

    /**
     * @param  list<ManifestMount>  $mounts
     *
     * @throws ManifestRefused
     */
    public function assertPermits(array $mounts): void
    {
        if ($this->installationName === null) {
            $this->assertLocal($mounts);

            return;
        }

        if ($mounts === [] || count($mounts) > self::MOST_CONTAINED_MOUNTS) {
            throw ManifestRefused::because('a contained helper has one to four mounts');
        }

        $targets = array_map(static fn (ManifestMount $mount) => $mount->target, $mounts);

        $driverTargets = array_map(fn (ManifestMount $mount) => $mount->target, $this->driverMounts);
        $allowed = [...self::CONTAINED_TARGETS, ...$driverTargets];

        if (array_diff($targets, $allowed) !== [] || count(array_unique($targets)) !== count($targets)) {
            throw ManifestRefused::because(
                'a contained helper mounts only its workspace, account, projects and session files, once each',
            );
        }

        array_map($this->assertContainedSource(...), $mounts);
    }

    /**
     * @param  list<ManifestMount>  $mounts
     *
     * @throws ManifestRefused
     */
    private function assertLocal(array $mounts): void
    {
        if (count($mounts) !== 1 || $mounts[0]->type !== HostMountType::Bind || $mounts[0]->target !== '/workspace') {
            throw ManifestRefused::because('a helper has exactly one mount, its workspace at /workspace');
        }

        $source = $mounts[0]->source;

        if (! str_starts_with($source, '/')
            || in_array('..', explode('/', $source), true)
            || substr_count(trim($source, '/'), '/') < 1) {
            throw ManifestRefused::because("the workspace {$source} is not an assigned workspace folder");
        }

        foreach (self::PROTECTED_SOURCES as $protected) {
            if (str_starts_with($source, $protected)
                || str_contains($source, $protected.'/')
                || str_ends_with($source, $protected)) {
                throw ManifestRefused::because("the mount {$source} reaches accounts, credentials or host control");
            }
        }
    }

    /**
     * @throws ManifestRefused
     */
    private function assertContainedSource(ManifestMount $mount): void
    {
        $isAllowed = match ($mount->type) {
            HostMountType::Volume => str_starts_with($mount->source, $this->installationName.'-')
                && strpbrk($mount->source, "/,\n") === false,
            HostMountType::DaemonBind => $mount->isPlanFile
                ? ! $mount->isWritable && ($mount->source === null || $this->isPlainFileName($mount->source))
                : $this->isDaemonFolder($mount->source),
            HostMountType::Scratch => $mount->source === null && $mount->isWritable,
            HostMountType::Bind => false,
        };

        if (! $isAllowed) {
            throw ManifestRefused::because("a contained helper may not mount {$mount->type->value} {$mount->target}");
        }
    }

    /**
     * A clean folder under /srv/journal/, and inside the accounts root only the session's own account folder.
     */
    private function isDaemonFolder(string $source): bool
    {
        $isClean = str_starts_with($source, self::DATA_FOLDER.'/')
            && ! in_array('..', explode('/', $source), true)
            && strpbrk($source, ",\n") === false;

        $isAccount = $source === self::ACCOUNTS_ROOT || str_starts_with($source, self::ACCOUNTS_ROOT.'/');

        return $isClean && (! $isAccount || $source === $this->accountSource);
    }

    /**
     * Whether the source is a bare file name, with no folder and not hidden.
     */
    private function isPlainFileName(string $source): bool
    {
        return $source === basename($source) && ! str_starts_with($source, '.');
    }
}
