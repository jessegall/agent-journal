<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenHostMainRuntime;

use App\Agents\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Agents\Enums\DriverVariant;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

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
     * The same opening as an OpenAgentRuntimeCommand on the host, in the variant the main agent resolved.
     */
    public function asAgentRuntime(DriverVariant $variant): OpenAgentRuntimeCommand
    {
        return new OpenAgentRuntimeCommand(
            $this->agentId,
            $this->hostId,
            $this->folder,
            $this->driver,
            $this->driverBuild,
            $this->profile,
            $variant,
            $this->model,
        );
    }
}
