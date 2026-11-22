<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\DriverVariant;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Opens the main runtime of a connected project's main agent in its folder, on the host of its binding. The agent
 * belongs to that project's own environment, so it takes no seat at this journal's main desk. Run for an authenticated
 * host by the journal itself (internal, not exported).
 *
 * @extends Command<OpenedRuntime>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class OpenBindingMainRuntime extends Command
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
     * The same opening as an OpenAgentRuntime on the host, in the variant the main agent resolved.
     */
    public function asAgentRuntime(DriverVariant $variant): OpenAgentRuntime
    {
        return new OpenAgentRuntime(
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
