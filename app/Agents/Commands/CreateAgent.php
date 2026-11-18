<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentRole;
use App\Agents\Handlers\CreateAgentHandler;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Creates an agent with a name and a role, and answers its id; its owner, such as Helpers, decides who it serves.
 *
 * @implements Command<string>
 */
#[HandledBy(CreateAgentHandler::class)]
final readonly class CreateAgent implements Command
{
    public function __construct(
        public string $name,
        public AgentRole $role,
    ) {}
}
