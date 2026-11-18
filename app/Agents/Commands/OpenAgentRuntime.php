<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\DriverType;
use App\Agents\Handlers\OpenAgentRuntimeHandler;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Opens a runtime for an agent on an enrolled host: a user may pick any host and permitted folder, an agent only
 * opens a child on its own session's host inside its own folder. One commit holds the session, the runtime in
 * Starting and the first delivery (doc 40, section 11).
 *
 * @implements Command<OpenedRuntime>
 */
#[HandledBy(OpenAgentRuntimeHandler::class)]
final readonly class OpenAgentRuntime implements Command
{
    public function __construct(
        public string $agentId,
        public string $hostId,
        public string $folder,
        public string $program,
        public string $programBuild,
        public string $profile,
        public DriverType $driverType,
        public string|null $model = null,
        public string|null $effort = null,
        public string|null $firstMessage = null,
    ) {}
}
