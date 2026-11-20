<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\AbandonNavigationHandler;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * The main agent gives up on a navigation request, saying why: the stalled key script ends and the runtime stays
 * held for the user.
 *
 * @extends Command<string>
 */
#[HandledBy(AbandonNavigationHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class AbandonNavigation extends Command
{
    public function __construct(
        public string $navigationId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}
}
