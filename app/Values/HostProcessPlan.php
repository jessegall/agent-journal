<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\ContainerManifest;
use App\Agents\Values\PlanFile;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProcessType;
use App\Hosts\Protocol\Payloads\HostOpenPlanPayload;
use App\Hosts\Protocol\Payloads\HostRestartFilePayload;
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
        public HostRestartFilePayload|null $restartWhenFile = null,
        /**
         * The fence of the session the process runs for, which a run_fenced instruction of that session closes; none for a
         * process of no session.
         */
        public string|null $fence = null,
        /**
         * The files a device keeps for its binding between two sessions, such as the driver's sign-in, each named
         * as the process sees it.
         */
        public array $keptFiles = [],
        /**
         * Whether the host sends the terminal's bytes from the first one, as a recording run asks.
         */
        public bool $isRawBytes = false,
    ) {}

    /**
     * The same plan asking the host for the terminal's bytes from the first one, as a recording keeps them.
     */
    public function askingRawBytes(): self
    {
        return new self(...[...get_object_vars($this), 'isRawBytes' => true]);
    }

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

    /**
     * The same plan as its host runs it in its container: the container made whole, its command and environment as
     * the container takes them, with no restart command and no files of its own left for the host.
     *
     * @param  list<string>  $command
     * @param  list<string>  $environment
     */
    public function asContained(ContainerManifest $container, array $command, array $environment): self
    {
        return new self(...[
            ...get_object_vars($this),
            'container' => $container,
            'argv' => $command,
            'environment' => $environment,
            'files' => [],
            'restartArgv' => [],
            'restartWhenFile' => null,
        ]);
    }

    public function instructionType(): HostInstructionType
    {
        if ($this->container === null) {
            return HostInstructionType::OpenProcess;
        }

        return HostInstructionType::OpenContainer;
    }

    /**
     * The instruction's payload as the host reads it.
     */
    public function payload(): HostOpenPlanPayload
    {
        return HostOpenPlanPayload::from([
            'type' => $this->type,
            'restart' => $this->restart->value,
            'argv' => $this->argv,
            'restart_argv' => $this->restartArgv,
            'restart_when_file' => $this->restartWhenFile,
            'environment' => $this->environment,
            'folder' => $this->folder,
            'container' => $this->container?->protocolData(),
            'size' => ['columns' => $this->columns, 'rows' => $this->rows],
            'files' => array_map(fn (PlanFile $file) => $file->protocolData(), $this->files),
            'folders' => $this->folders,
            'inherit' => $this->inherit,
            'side_sockets' => $this->sideSockets,
            'read_files' => $this->readFiles,
            'shield_rules' => array_map(fn (ShieldRule $rule) => $rule->protocolData(), $this->shieldRules),
            'fence' => $this->fence,
            'kept_files' => $this->keptFiles,
            'raw_bytes' => $this->isRawBytes,
        ]);
    }
}
