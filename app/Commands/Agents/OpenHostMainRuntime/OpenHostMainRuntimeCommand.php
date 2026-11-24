<?php

declare(strict_types=1);

namespace App\Commands\Agents\OpenHostMainRuntime;

use App\Attributes\Entry;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Enums\CommandEntry;
use App\Enums\DriverType;
use App\Support\Command;
use App\Support\OpenedRuntime;

/**
 * Opens an agent's main runtime as a terminal on the host the user attached from, for journal-agent attach, and seats
 * the agent at this journal's main desk. A connected project's main agent opens through OpenBindingMainRuntimeCommand
 * instead. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<OpenedRuntime>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class OpenHostMainRuntimeCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $hostId,
        public string $folder,
        public string $driver,
        public string $driverBuild,
        public string $profile,
        public string|null $model,
    ) {}

    /**
     * The same opening as an OpenAgentRuntimeCommand on the host, in the driver type the main agent resolved.
     */
    public function asAgentRuntime(DriverType $driverType): OpenAgentRuntimeCommand
    {
        return new OpenAgentRuntimeCommand(
            $this->agentId,
            $this->hostId,
            $this->folder,
            $this->driver,
            $this->driverBuild,
            $this->profile,
            $driverType,
            $this->model,
        );
    }
}
