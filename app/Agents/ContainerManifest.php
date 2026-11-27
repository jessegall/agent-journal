<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Drivers\Enums\StartProfileType;
use App\Agents\Enums\WorkspaceUse;
use App\Agents\Exceptions\ManifestRefused;
use App\Files\ManifestMount;
use App\Hosts\ContainerLabels;
use App\Hosts\Protocol\Payloads\HostContainerLabelPayload;
use App\Hosts\Protocol\Payloads\HostContainerManifestPayload;
use App\Hosts\Protocol\Payloads\HostContainerRunPayload;
use App\Hosts\Protocol\Payloads\HostContainerTmpfsPayload;
use App\Hosts\Protocol\Payloads\HostContainerVolumePayload;
use App\Sessions\Values\ExecutionPolicy;
use App\Support\MountRules;
use App\Values\ExecutionBudgets;

/**
 * The whole container the journal has its host start, as the host hands it to Docker: the image by digest, the user
 * and entrypoint of its start profile, a read-only root with every capability dropped but the profile's, its mounts,
 * memory folders, labels and budgets, the network and volumes made for it, and the helper runs that come first.
 */
final readonly class ContainerManifest
{
    public const string USER = '10001:10001';

    public const string WORKDIR = '/workspace';

    /**
     * The memory folders every container writes to, with their sizes when the budgets name none.
     */
    private const int DEFAULT_TMP_BYTES = 256 << 20;

    private const int RUN_JOURNAL_BYTES = 16 << 20;

    private const int DEFAULT_HOME_BYTES = 64 << 20;

    /**
     * @param  list<ManifestMount>  $mounts
     * @param  list<HostContainerTmpfsPayload>  $tmpfs
     * @param  list<HostContainerVolumePayload>  $volumes
     * @param  list<HostContainerLabelPayload>  $labels
     * @param  list<HostContainerRunPayload>  $preparations
     */
    private function __construct(
        public string $name,
        public string $image,
        public string $workdir,
        public SecurityOptions $securityOptions,
        public string $network,
        public array $mounts,
        public array $tmpfs,
        public array $volumes,
        public array $labels,
        public ExecutionBudgets $budgets,
        public bool $isAttachable,
        public StartProfileType $startProfile,
        public array $preparations,
    ) {}

    /**
     * The same container for a process on pipes, such as a start's sign-in probe: no terminal is attached to it, so
     * what it prints is read from its log from its first byte on.
     */
    public function onPipes(): self
    {
        return clone ($this, ['isAttachable' => false]);
    }

    /**
     * The same container under its name on the agent daemon.
     */
    public function named(string $name): self
    {
        return clone ($this, ['name' => $name]);
    }

    /**
     * The same container with more helper runs before it, in order.
     *
     * @param  list<HostContainerRunPayload>  $preparations
     */
    public function preparedBy(array $preparations): self
    {
        return clone ($this, ['preparations' => [...$this->preparations, ...$preparations]]);
    }

    /**
     * The same container with the checkout's own builds of the image's programs bound read-only over the image's
     * copies, from the agent daemon's folder of them; local development only, none when no folder is named.
     */
    public function withDevelopmentPrograms(string $folder): self
    {
        if ($folder === '') {
            return $this;
        }

        $programs = ['journal-init', 'journal-exec', 'journal-shell', 'journal-hook', 'journal-mcp', 'journal-check'];
        $mounts = array_map(
            fn (string $program) => ManifestMount::daemonBind("{$folder}/{$program}", "/opt/journal/bin/{$program}", false),
            $programs,
        );
        $shell = ManifestMount::daemonBind("{$folder}/journal-shell", '/opt/journal/shell/bash', false);

        return clone ($this, ['mounts' => [...$this->mounts, ...$mounts, $shell]]);
    }

    /**
     * The same container with its plan file mounts bound to the folder its process's plan files are written to.
     */
    public function withPlanFilesIn(string $filesFolder): self
    {
        $mounts = array_map(fn (ManifestMount $mount) => $mount->placedIn($filesFolder), $this->mounts);

        return clone ($this, ['mounts' => $mounts]);
    }

    /**
     * Whether a mount of the container is one of its plan's files.
     */
    public function mountsPlanFiles(): bool
    {
        return array_any($this->mounts, fn (ManifestMount $mount) => $mount->isPlanFile);
    }

    /**
     * The folders right inside the account mount that the container mounts something else over, which must exist as
     * the program's user's before Docker mounts there.
     *
     * @return list<string>
     */
    public function accountMountPoints(): array
    {
        $inside = array_filter(
            $this->mounts,
            fn (ManifestMount $mount) => dirname($mount->target) === MountRules::ACCOUNT_TARGET,
        );

        return array_values(array_map(fn (ManifestMount $mount) => basename($mount->target), $inside));
    }

    /**
     * The manifest as the host reads it.
     *
     * @throws ManifestRefused
     */
    public function protocolData(): HostContainerManifestPayload
    {
        return HostContainerManifestPayload::from([
            'name' => $this->name,
            'image' => $this->image,
            'user' => $this->startProfile->user(),
            'workdir' => $this->workdir,
            'entrypoint' => $this->startProfile->entrypoint(),
            'isReadOnlyRoot' => true,
            'capabilities' => $this->startProfile->capabilities(),
            'blocksNewPrivileges' => true,
            'network' => $this->network,
            'networkLabels' => array_values(array_filter(
                $this->labels,
                fn (HostContainerLabelPayload $label) => $label->name === ContainerLabels::SESSION,
            )),
            'mounts' => array_map(fn (ManifestMount $mount) => $mount->protocolData(), $this->mounts),
            'tmpfs' => [...$this->tmpfs, ...$this->startProfile->tmpfs()],
            'volumes' => $this->volumes,
            'labels' => $this->labels,
            'budgets' => $this->budgets->hostBudgets(),
            'securityOptions' => $this->securityOptions->protocolData(),
            'isAttachable' => $this->isAttachable,
            'restart' => 'no',
            'preparations' => $this->preparations,
        ]);
    }

    /**
     * The manifest of one session's start: its workspace mounted at /workspace as its arrangement places it and as the
     * session uses it, read-only, shared or its own clone; its driver its own terminal process when the execution
     * policy makes it attachable.
     *
     * @param  list<HostContainerLabelPayload>  $labels
     *
     * @throws ManifestRefused
     */
    public static function compile(
        string $sessionId,
        string $workspace,
        WorkspaceUse $use,
        ExecutionPolicy $policy,
        string $network,
        MountRules $rules,
        string|null $resumedSessionId,
        SecurityOptions $security,
        array $labels,
        StartProfileType $startProfile = StartProfileType::Standard,
    ): self {
        $mounts = [
            $rules->workspaceMount($workspace, $use, $sessionId),
            ...$rules->accountMounts(),
            ...$rules->sessionMounts($sessionId, $resumedSessionId),
        ];

        if ($startProfile->isForAnAccount() && ! $rules->bindsAccount($mounts)) {
            throw ManifestRefused::because('a protected start binds the account folder it protects');
        }

        if (in_array($network, ['host', 'none', ''], true)) {
            throw ManifestRefused::because("the network {$network} is not a dedicated start network");
        }

        $rules->assertPermits($mounts);

        return new self(
            '',
            self::pinned((string) $policy->imageReference),
            self::WORKDIR,
            $security,
            $network,
            $mounts,
            self::memoryFolders($policy->budgets),
            $rules->sessionVolumes($sessionId, $resumedSessionId, $use, $policy->budgets->workspaceBytes),
            $labels,
            $policy->budgets,
            $policy->isAttachable,
            $startProfile,
            [],
        );
    }

    /**
     * The manifest of a throwaway check of the agent image: its standard user on a read-only root, no capability, no
     * network and no mount, under the security profiles the agent containers run under.
     *
     * @throws ManifestRefused
     */
    public static function probe(string $image, SecurityOptions $securityOptions): self
    {
        $budgets = ExecutionBudgets::defaults();

        return new self(
            '',
            self::pinned($image),
            self::WORKDIR,
            $securityOptions,
            'none',
            [],
            self::memoryFolders($budgets),
            [],
            [],
            $budgets,
            false,
            StartProfileType::Standard,
            [],
        );
    }

    /**
     * @throws ManifestRefused
     */
    private static function pinned(string $image): string
    {
        if (preg_match('/(^|@)sha256:[0-9a-f]{64}$/', $image) !== 1) {
            throw ManifestRefused::because("the image {$image} is not named by its digest");
        }

        return $image;
    }

    /**
     * The memory folders every container writes to: /tmp and the home sized by the budgets, and the journal's run
     * folder.
     *
     * @return list<HostContainerTmpfsPayload>
     */
    private static function memoryFolders(ExecutionBudgets $budgets): array
    {
        $tmp = $budgets->tmpBytes > 0 ? $budgets->tmpBytes : self::DEFAULT_TMP_BYTES;
        $home = $budgets->homeBytes > 0 ? $budgets->homeBytes : self::DEFAULT_HOME_BYTES;

        return [
            HostContainerTmpfsPayload::from(['target' => '/tmp', 'options' => "size={$tmp}"]),
            HostContainerTmpfsPayload::from(['target' => '/run/journal', 'options' => 'size='.self::RUN_JOURNAL_BYTES]),
            HostContainerTmpfsPayload::from(['target' => '/home/journal', 'options' => "size={$home}"]),
        ];
    }
}
