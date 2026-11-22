<?php

declare(strict_types=1);

namespace App\Commands\AbandonNavigation;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;

/**
 * The main agent gives up on a navigation request, saying why: the stalled key script ends and the runtime stays
 * held for the user.
 *
 * @extends Command<string>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class AbandonNavigationCommand extends Command
{
    public function __construct(
        public string $navigationId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}
}
