<?php

declare(strict_types=1);

namespace App\Navigation\Commands\ProveNavigation;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Navigation\Enums\NavigationCompletion;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\DriverReceipt;

/**
 * The main agent says its rounds reached the goal, or repaired the stalled step, and names the text that shows it;
 * the host checks the text on the screen before anything counts.
 *
 * @extends Command<DriverReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class ProveNavigationCommand extends Command
{
    public function __construct(
        public string $navigationId,
        public int $expectedRowVersion,
        public NavigationCompletion $completes,
        public string $proof,
    ) {}
}
