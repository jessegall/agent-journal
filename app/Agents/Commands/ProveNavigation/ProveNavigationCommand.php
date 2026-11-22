<?php

declare(strict_types=1);

namespace App\Agents\Commands\ProveNavigation;

use App\Agents\Enums\NavigationCompletion;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Values\DriverReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

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
