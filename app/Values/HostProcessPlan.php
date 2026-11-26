<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\ContainerManifest;
use App\Agents\Values\PlanFile;
use App\Agents\Values\RestartFile;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessType;
use App\Hosts\Enums\RestartPolicy;
use App\Terminals\Screens\ShieldRule;

/**
 * How a host is to open one process: what it is for, terminal or pipes, whether it is healed, its argv and
 * environment, each variable as NAME=value, its folder, the container it runs in when it is contained, and the files
 * the host writes into the process's own files folder first, which argv, environment and mounts name as {folder:files};
 * each of its folders is an empty folder of the process's own, named {folder:<name>}, and each name it inherits is a
 * variable of the host's own environment, passed on when the host has it. Each side socket is a socket the host listens
 * on beside the process, in {folder:sockets}, whose bytes arrive as output of a stream of its name.
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
         * A plan file holding the Seatbelt profile the process runs under where the host has Seatbelt
         */
        public string|null $seatbelt = null,
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
    ) {}

    /**
     * The same plan under the fence of the session it runs for.
     */
    public function withFence(string $sessionId): self
    {
        return new self(...[...get_object_vars($this), 'fence' => $sessionId]);
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
            'seatbelt' => $this->seatbelt,
            'read_files' => $this->readFiles,
            'shield_rules' => $this->shieldRules,
            'restart_argv' => $this->restartArgv,
            'restart_when_file' => $this->restartWhenFile,
            'fence' => $this->fence,
        ];
    }
}
