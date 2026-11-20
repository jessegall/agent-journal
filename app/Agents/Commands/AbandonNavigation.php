<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\AbandonNavigationHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * The main agent gives up on a navigation request, saying why: the stalled key script ends and the runtime stays
 * held for the user.
 *
 * @extends Command<string>
 */
#[HandledBy(AbandonNavigationHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Navigate)]
#[Operation('navigation_give_up', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class AbandonNavigation extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $navigationId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
