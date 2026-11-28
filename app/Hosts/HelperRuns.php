<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Agents\ContainerManifest;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\ManifestMount;
use App\Hosts\Protocol\Payloads\HostContainerManifestPayload;
use App\Hosts\Protocol\Payloads\HostContainerRunPayload;
use App\Support\HelperMounts;
use App\Values\FilePath;
use Illuminate\Container\Attributes\Config;

/**
 * The containers the journal has the host run to their end beside a session's own: making, checking and removing
 * account folders, checking and cloning workspaces, writing plan files and removing them. Each runs one script of
 * resources/host-scripts from the agent image, with every capability dropped but those its work needs.
 */
final readonly class HelperRuns
{
    private const string SCRIPTS = 'resources/host-scripts';

    /**
     * The program's user, who owns every folder the program works in.
     */
    private const string ROOT_USER = '0';

    /**
     * What a root helper needs to hand a folder to the program's user and to remove one that user filled.
     */
    private const array FOLDER_CAPABILITIES = [
        'CHOWN',
        'FOWNER',
        'DAC_OVERRIDE',
    ];

    /**
     * The branch a cloned workspace works on.
     */
    private const string WORKSPACE_BRANCH = 'version-6';

    /**
     * Where a helper finds the accounts root, the source of a writer's checkout, and the one folder it writes to.
     */
    private const string ACCOUNTS_TARGET = '/accounts';

    private const string ACCOUNT_TARGET = '/account';

    private const string SOURCE_TARGET = '/source';

    private const string SESSIONS_TARGET = '/sessions';

    /**
     * The memory folder a clone keeps its key in, the program's user's alone, where nothing can be run.
     */
    private const string CLONE_TMPFS = 'rw,noexec,nosuid,mode=0700,uid=10001';

    private const array CLONE_ENVIRONMENT = [
        'HOME=/tmp',
        'GIT_CONFIG_NOSYSTEM=1',
        'GIT_TERMINAL_PROMPT=0',
    ];

    private const int OUTPUT_LIMIT = 16384;

    /**
     * How long a helper run may take before the host ends it: a clone reaches the network, the rest only the disk.
     */
    private const int RUN_DEADLINE_MS = 60_000;

    private const int CLONE_DEADLINE_MS = 600_000;

    public function __construct(
        private Files $files,
        #[Config('journal.agents.agent_image')]
        private string $image,
    ) {}

    public function accountFolderMake(string $account, string $operation): HostContainerRunPayload
    {
        $arguments = [
            self::ACCOUNTS_TARGET,
            $account,
            $operation,
            ContainerManifest::PROGRAM_USER,
        ];

        return $this->run('account-folder-make', $arguments, [
            'user' => self::ROOT_USER.':'.self::ROOT_USER,
            'capabilities' => self::FOLDER_CAPABILITIES,
            'mounts' => [ManifestMount::daemonBind(HelperMounts::ACCOUNTS_ROOT, self::ACCOUNTS_TARGET, true)],
        ]);
    }

    public function accountFolderRemove(string $account): HostContainerRunPayload
    {
        return $this->run('account-folder-remove', [self::ACCOUNTS_TARGET, $account], [
            'user' => self::ROOT_USER.':'.self::ROOT_USER,
            'capabilities' => self::FOLDER_CAPABILITIES,
            'mounts' => [ManifestMount::daemonBind(HelperMounts::ACCOUNTS_ROOT, self::ACCOUNTS_TARGET, true)],
        ]);
    }

    /**
     * The runs before a protected start: the account's mount points made and its files kept private as the program's
     * user, then the check that the folder and those above it are private to that user.
     *
     * @param  list<string>  $mountPoints  the folders right inside the account that the start mounts something over
     * @return list<HostContainerRunPayload>
     */
    public function accountFolderChecks(string $account, array $mountPoints): array
    {
        return [
            $this->run('account-folder-prepare', [self::ACCOUNT_TARGET, ...$mountPoints], [
                'mounts' => [ManifestMount::daemonBind(HelperMounts::accountFolder($account), self::ACCOUNT_TARGET, true)],
            ]),
            $this->run('account-folder-check', [
                HelperMounts::DATA_FOLDER,
                $account,
                ContainerManifest::PROGRAM_USER,
                self::ROOT_USER,
            ], [
                'mounts' => [ManifestMount::daemonBind(HelperMounts::DATA_FOLDER, HelperMounts::DATA_FOLDER, false)],
            ]),
        ];
    }

    public function workspaceFolderCheck(string $folder): HostContainerRunPayload
    {
        return $this->run('workspace-folder-check', [$folder, ContainerManifest::PROGRAM_USER], [
            'mounts' => [ManifestMount::daemonBind($folder, $folder, false)],
        ]);
    }

    /**
     * The clone that fills a Git workspace's volume the first time, with the deploy key of the host's secret.
     */
    public function workspaceClone(string $volume, string $repository, string $revision, string $deployKeySecret): HostContainerRunPayload
    {
        $arguments = [
            $repository,
            $revision,
            self::WORKSPACE_BRANCH,
            ContainerManifest::WORKDIR,
        ];

        return $this->run('workspace-clone', $arguments, [
            'network' => 'bridge',
            'tmpfs' => [['target' => '/tmp', 'options' => self::CLONE_TMPFS]],
            'mounts' => [ManifestMount::volume($volume, ContainerManifest::WORKDIR, true)],
        ], self::CLONE_ENVIRONMENT, $deployKeySecret);
    }

    /**
     * The runs that give a writer its own clone of the main workspace, then check the clone.
     *
     * @return list<HostContainerRunPayload>
     */
    public function writerCheckout(ManifestMount $source, string $volume): array
    {
        $checkout = ManifestMount::volume($volume, ContainerManifest::WORKDIR, true);
        $arguments = [
            self::SOURCE_TARGET,
            'HEAD',
            self::WORKSPACE_BRANCH,
            ContainerManifest::WORKDIR,
        ];
        $sourceMount = $source->readOnlyAt(self::SOURCE_TARGET);

        return [
            $this->run('workspace-checkout', $arguments, [
                'tmpfs' => [['target' => '/tmp', 'options' => self::CLONE_TMPFS]],
                'mounts' => [$sourceMount, $checkout],
            ], self::CLONE_ENVIRONMENT),
            $this->run('workspace-folder-check', [ContainerManifest::WORKDIR, ContainerManifest::PROGRAM_USER], [
                'mounts' => [$checkout->readOnlyAt(ContainerManifest::WORKDIR)],
            ]),
        ];
    }

    /**
     * The run that writes a process's plan files, a tar on its input, into the folder its plan file mounts bind.
     */
    public function planFiles(string $session, string $process, string $archive): HostContainerRunPayload
    {
        $folder = self::SESSIONS_TARGET."/{$session}/{$process}/files";

        return $this->run('plan-files-write', [$folder, self::SESSIONS_TARGET."/{$session}"], [
            'user' => self::ROOT_USER.':'.self::ROOT_USER,
            'capabilities' => self::FOLDER_CAPABILITIES,
            'mounts' => [ManifestMount::daemonBind(HelperMounts::SESSIONS_ROOT, self::SESSIONS_TARGET, true)],
        ], input: $archive);
    }

    public function sessionFilesRemove(string $session): HostContainerRunPayload
    {
        return $this->run('session-files-remove', [self::SESSIONS_TARGET."/{$session}"], [
            'user' => self::ROOT_USER.':'.self::ROOT_USER,
            'capabilities' => self::FOLDER_CAPABILITIES,
            'mounts' => [ManifestMount::daemonBind(HelperMounts::SESSIONS_ROOT, self::SESSIONS_TARGET, true)],
        ]);
    }

    /**
     * The daemon folder that holds one process's plan files.
     */
    public static function planFilesFolder(string $session, string $process): string
    {
        return HelperMounts::SESSIONS_ROOT."/{$session}/{$process}/files";
    }

    /**
     * One script run to its end: the script's text handed to sh with its name and arguments, in a container of the
     * agent image with no network unless named, a read-only root and no new privileges.
     *
     * @param  list<string>  $arguments
     * @param  array{user?: string, capabilities?: list<string>, network?: string, tmpfs?: list<array{target: string, options: string}>, mounts?: list<ManifestMount>}  $container
     * @param  list<string>  $environment
     */
    private function run(
        string $script,
        array $arguments,
        array $container,
        array $environment = [],
        string $inputSecret = '',
        string $input = '',
    ): HostContainerRunPayload {
        $text = $this->files->read(FilePath::in(Place::Project, self::SCRIPTS."/{$script}.sh"));
        $mounts = $container['mounts'] ?? [];

        return HostContainerRunPayload::from([
            'manifest' => HostContainerManifestPayload::from([
                'name' => '',
                'image' => $this->image,
                'user' => $container['user'] ?? ContainerManifest::USER,
                'workdir' => '/',
                'entrypoint' => [],
                'isReadOnlyRoot' => true,
                'capabilities' => $container['capabilities'] ?? [],
                'blocksNewPrivileges' => true,
                'network' => $container['network'] ?? 'none',
                'networkLabels' => [],
                'mounts' => array_map(fn (ManifestMount $mount) => $mount->protocolData(), $mounts),
                'tmpfs' => $container['tmpfs'] ?? [],
                'volumes' => [],
                'labels' => [],
                'budgets' => [
                    'cpuCores' => 0,
                    'memoryBytes' => 0,
                    'memorySwapBytes' => 0,
                    'processes' => 0,
                    'openFiles' => 0,
                ],
                'securityOptions' => ['seccomp' => '', 'apparmor' => ''],
                'isAttachable' => false,
                'takesInput' => false,
                'restart' => 'no',
                'preparations' => [],
            ]),
            'command' => ['sh', '-c', $text, $script, ...$arguments],
            'environment' => $environment,
            'input' => $input === '' ? null : base64_encode($input),
            'inputSecret' => $inputSecret === '' ? null : $inputSecret,
            'outputLimit' => self::OUTPUT_LIMIT,
            'deadlineMs' => ($container['network'] ?? 'none') === 'none' ? self::RUN_DEADLINE_MS : self::CLONE_DEADLINE_MS,
        ]);
    }
}
