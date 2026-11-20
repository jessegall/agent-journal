<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\CloseTerminalViewHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * A viewer stops watching an agent's terminal; other viewers keep theirs.
 *
 * @extends Command<void>
 */
#[HandledBy(CloseTerminalViewHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Inspect)]
#[Operation('close_terminal_view', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class CloseTerminalView extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $agentId,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
