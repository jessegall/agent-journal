<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\AbandonNavigationHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * The main agent gives up on a navigation request, saying why: the stalled key script ends and the runtime stays
 * held for the person.
 *
 * @extends Command<null>
 */
#[HandledBy(AbandonNavigationHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Navigate)]
final readonly class AbandonNavigation extends Command implements HasAuthorizationSubject
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
