<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\ContainerManifest;
use App\Agents\Values\PlanFile;
use App\Agents\Values\RestartFile;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostOrderType;
use App\Hosts\Protocol\HostProcessType;
use App\Hosts\Protocol\HostProtocol;
use App\Hosts\Values\ContainerLabels;
use App\Terminals\Screens\ShieldRule;

/**
 * How a host opens one process: its purpose, terminal or pipes, whether it is healed, argv and environment, folder,
 * container and the files the host writes first into {folder:files}. Its folders are empty folders of its own,
 * {folder:<name>}, and each side socket in {folder:sockets} streams its bytes as output under its name.
 */
final readonly class HostProcessPlan
{
    /**
     * @param  list<string>  $argv
     * @param  list<string>  $environment
     * @param  list<PlanFile>  $files
     * @param  list<string>  $folders
     * @param  list<string>  $inherit
     * @param  list<string>  $sideSockets
     * @param  list<string>  $readFiles
     * @param  list<ShieldRule>  $shieldRules
     * @param  list<string>  $restartArgv
     * @param  list<string>  $keptFiles
     */
    public function __construct(
        public HostProcessPurpose $purpose,
        public HostProcessType $type,
        public RestartPolicy $restart,
        public array $argv,
        public array $environment,
        public string $folder,
        public ContainerManifest|null $container = null,
        public int $columns = 120,
        public int $rows = 40,
        public array $files = [],
        public array $folders = [],
        public array $inherit = [],
        public array $sideSockets = [],
        /**
         * Files the host opens read-only for the process, handed over as its descriptors 3 on
         */
        public array $readFiles = [],
        /**
         * The screens of a terminal the host shields before any frame of them leaves the machine.
         */
        public array $shieldRules = [],
        /**
         * What a process the host heals after a crash runs once its restart file exists, such as a resume.
         */
        public array $restartArgv = [],
        public RestartFile|null $restartWhenFile = null,
        /**
         * The fence of the session the process runs for, which a run_fenced order of that session closes; none for a
         * process of no session.
         */
        public string|null $fence = null,
        /**
         * The labels the container carries on the agent daemon, so the host finds it again; none outside a container.
         */
        public ContainerLabels|null $labels = null,
        /**
         * The files a device keeps for its binding between two sessions, such as the driver's sign-in, each named
         * as the process sees it.
         */
        public array $keptFiles = [],
    ) {}

    /**
     * The same plan under the fence of the session it runs for.
     */
    public function withFence(string $sessionId): self
    {
        return new self(...[...get_object_vars($this), 'fence' => $sessionId]);
    }

    /**
     * The same plan run in the container, in its working folder.
     */
    public function inContainer(ContainerManifest $container): self
    {
        return new self(...[...get_object_vars($this), 'container' => $container, 'folder' => $container->workdir]);
    }

    /**
     * The same plan with more variables in its environment, each as NAME=value.
     *
     * @param  list<string>  $environment
     */
    public function withEnvironment(array $environment): self
    {
        return new self(...[...get_object_vars($this), 'environment' => [...$this->environment, ...$environment]]);
    }

    public function orderType(): HostOrderType
    {
        if ($this->container === null) {
            return HostOrderType::OpenProcess;
        }

        return HostOrderType::OpenContainer;
    }

    /**
     * The plan fields of host protocol 1's contained plan rule this plan sets: none for a plan the rule takes.
     *
     * @return list<string>
     */
    public function hostFieldsNamed(): array
    {
        $payload = $this->payload();

        return array_values(array_filter(
            HostProtocol::CONTAINED_REFUSED_FIELDS,
            fn (string $field) => $payload[$field] !== [],
        ));
    }

    /**
     * The start grant variables this plan lacks while it carries others of them: none for a whole grant or none.
     *
     * @return list<string>
     */
    public function missingGrantVariables(): array
    {
        $carried = array_map(fn (string $entry) => explode('=', $entry, 2)[0], $this->environment);
        $missing = array_values(array_diff(HostProtocol::CONTAINED_START_GRANT_ENVIRONMENT, $carried));

        if (count($missing) === count(HostProtocol::CONTAINED_START_GRANT_ENVIRONMENT)) {
            return [];
        }

        return $missing;
    }

    /**
     * The order's payload as the host reads it.
     *
     * @return array<string, mixed>
     */
    public function payload(): array
    {
        return [
            'type' => $this->type->value,
            'restart' => $this->restart->value,
            'argv' => $this->argv,
            'environment' => $this->environment,
            'folder' => $this->folder,
            'container' => $this->container,
            'size' => [
                'columns' => $this->columns,
                'rows' => $this->rows,
            ],
            'files' => $this->files,
            'folders' => $this->folders,
            'inherit' => $this->inherit,
            'side_sockets' => $this->sideSockets,
            'read_files' => $this->readFiles,
            'shield_rules' => $this->shieldRules,
            'restart_argv' => $this->restartArgv,
            'restart_when_file' => $this->restartWhenFile,
            'fence' => $this->fence,
            'labels' => $this->labels,
            'kept_files' => $this->keptFiles,
        ];
    }
}
