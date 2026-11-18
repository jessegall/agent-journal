<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Enums\ActorType;
use App\Agents\Enums\DriverType;
use App\Agents\Handlers\OpenHostMainRuntimeHandler;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;

/**
 * Opens an agent's main runtime as a terminal on the host the person attached from, for journal-agent attach. Run for
 * an authenticated host by the journal itself (internal, not exported).
 *
 * @implements Command<OpenedRuntime>
 */
#[HandledBy(OpenHostMainRuntimeHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class OpenHostMainRuntime implements Command
{
    public function __construct(
        public string $agentId,
        public string $hostId,
        public string $folder,
        public string $program,
        public string $programBuild,
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
            $this->program,
            $this->programBuild,
            $this->profile,
            DriverType::Terminal,
            $this->model,
        );
    }
}
