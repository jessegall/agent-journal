<?php

declare(strict_types=1);

namespace App\Commands\Agents\OpenBindingMainRuntime;

use App\Attributes\Entry;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Drivers\DriverType;
use App\Support\Command;
use App\Support\OpenedRuntime;

/**
 * Opens the main runtime of a connected project's main agent in its folder, on the host of its binding. The agent
 * belongs to that project's own environment, so it takes no seat at this journal's main desk. Run for an authenticated
 * host by the journal itself (internal, not exported).
 *
 * @extends Command<OpenedRuntime>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class OpenBindingMainRuntimeCommand extends Command
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
