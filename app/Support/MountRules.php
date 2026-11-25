<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Files\WorkspaceSource;
use App\Enums\MountType;
use App\Enums\WorkspaceUse;
use App\Exceptions\ManifestRefused;
use App\Values\WorkspacePreparation;

/**
 * Which mounts a helper container may have: in the local arrangement exactly one folder of this machine at
 * /workspace; contained, one to four mounts of the agent daemon on their own folders, volumes of this installation
 * and folders under /srv/journal/, an account folder only the session's own.
 */
final readonly class MountRules
{
    private const string DAEMON_ROOT = '/srv/journal/';

    private const string ACCOUNTS_ROOT = '/srv/journal/accounts';

    /**
     * The session folder and the file in it that hold the managed settings a contained Claude Code reads.
     */
    public const string MANAGED_SETTINGS_FOLDER = 'managed';

    public const string MANAGED_SETTINGS_FILE = 'managed-settings.json';

    private const int MOST_CONTAINED_MOUNTS = 5;

    private const string ACCOUNT_TARGET = '/home/journal/.account';

    private const string PROJECTS_TARGET = self::ACCOUNT_TARGET.'/projects';

    private const string SESSIONS_ROOT = '/srv/journal/sessions';

    /**
     * Where a contained session finds the files the journal hands its start, such as its skills, read-only; under
     * /tmp, the one folder outside the workspace its driver's file tools may read.
     */
    private const string SESSION_TARGET = '/tmp/journal-session';

    /**
     * Where Claude Code reads the managed settings no session may change.
     */
    private const string MANAGED_SETTINGS_TARGET = '/etc/claude-code/managed-settings.json';

    private const array CONTAINED_TARGETS = [
        '/workspace',
        self::ACCOUNT_TARGET,
        self::PROJECTS_TARGET,
        self::SESSION_TARGET,
        self::MANAGED_SETTINGS_TARGET,
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

    private function __construct(
        public string|null $installationName,
        public string|null $accountSource,
        public WorkspaceSource|null $workspaceSource,
    ) {}

    public static function local(): self
    {
        return new self(null, null, null);
    }

    /**
     * The rules of a contained session: its volumes open with the installation name, its workspace comes from its
     * environment's declared source, and the one account folder it may mount, when it has an account, is its own.
     */
    public static function contained(
        string $installationName,
        string|null $accountSource,
        WorkspaceSource $workspaceSource,
    ): self {
        return new self($installationName, $accountSource, $workspaceSource);
    }

    /**
     * The mount that puts the start's workspace at /workspace: locally the start's own folder on this machine;
     * contained, its environment's volume or server folder, which the host fills or checks before the container, or
     * for a writing helper its own clone of it.
     */
    public function workspaceMount(string $localFolder, WorkspaceUse $use): ManifestMount
    {
        if ($this->workspaceSource === null) {
            return ManifestMount::bind($localFolder, ContainerManifest::WORKDIR, $use->isWritable());
        }

        if ($use->isOwnCheckout()) {
            return ManifestMount::checkoutOf($this->workspaceSource->mount(false));
        }

        return $this->workspaceSource->mount($use->isWritable());
    }

    /**
     * What the host makes ready before a contained container mounts the workspace; none locally, where the start's
     * own folder is bound as it is.
     */
    public function workspacePreparation(): WorkspacePreparation|null
    {
        return $this->workspaceSource?->preparation();
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
     * folder, so sessions on one account never read each other's conversations, and its own files from the host, such
     * as its skills, read-only, with the managed settings among them mounted where Claude Code reads them. A session that resumes a conversation mounts the history of the session that held it,
     * which must still exist. A local session has none; its sandbox profile hides the other sessions' history.
     *
     * @return list<ManifestMount>
     */
    public function sessionMounts(string $sessionId, string|null $resumedSessionId): array
    {
        if ($this->installationName === null) {
            return [];
        }

        $folder = self::SESSIONS_ROOT.'/'.$sessionId;
        $files = ManifestMount::daemonBind($folder, self::SESSION_TARGET, false);
        $settings = ManifestMount::daemonBind(
            $folder.'/'.self::MANAGED_SETTINGS_FOLDER.'/'.self::MANAGED_SETTINGS_FILE,
            self::MANAGED_SETTINGS_TARGET,
            false,
        );

        if ($resumedSessionId !== null) {
            $history = "{$this->installationName}-history-{$resumedSessionId}";

            return [
                ManifestMount::existingVolume($history, self::PROJECTS_TARGET, true),
                $files,
                $settings,
            ];
        }

        $history = ManifestMount::volume("{$this->installationName}-history-{$sessionId}", self::PROJECTS_TARGET, true);

        return [
            $history,
            $files,
            $settings,
        ];
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

        if (array_diff($targets, self::CONTAINED_TARGETS) !== [] || count(array_unique($targets)) !== count($targets)) {
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
        if (count($mounts) !== 1 || $mounts[0]->type !== MountType::Bind || $mounts[0]->target !== '/workspace') {
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
            MountType::Volume => str_starts_with($mount->source, $this->installationName.'-')
                && strpbrk($mount->source, "/,\n") === false,
            MountType::DaemonBind => $this->isDaemonFolder($mount->source),
            MountType::Bind => false,
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
        $isClean = str_starts_with($source, self::DAEMON_ROOT)
            && ! in_array('..', explode('/', $source), true)
            && strpbrk($source, ",\n") === false;

        $isAccount = $source === self::ACCOUNTS_ROOT || str_starts_with($source, self::ACCOUNTS_ROOT.'/');

        return $isClean && (! $isAccount || $source === $this->accountSource);
    }
}
