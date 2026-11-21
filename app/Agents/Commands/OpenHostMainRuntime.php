<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\DriverVariant;
use App\Agents\Handlers\OpenHostMainRuntimeHandler;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Opens an agent's main runtime as a terminal on the host the user attached from, for journal-agent attach. Run for
 * an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<OpenedRuntime>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(OpenHostMainRuntimeHandler::class)]
final readonly class OpenHostMainRuntime extends Command
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
     * The same opening as an OpenAgentRuntime of a terminal runtime on the host.
     */
    public function asAgentRuntime(): OpenAgentRuntime
    {
        return new OpenAgentRuntime(
            $this->agentId,
            $this->hostId,
            $this->folder,
            $this->driver,
            $this->driverBuild,
            $this->profile,
            DriverVariant::Terminal,
            $this->model,
        );
    }
}
