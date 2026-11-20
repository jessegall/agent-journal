<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Enums\NavigationCompletion;
use App\Agents\Handlers\ProveNavigationHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\DriverReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * The main agent says its rounds reached the goal, or repaired the stalled step, and names the text that shows it;
 * the host checks the text on the screen before anything counts.
 *
 * @extends Command<DriverReceipt>
 */
#[HandledBy(ProveNavigationHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Navigate)]
#[Operation('navigation_done', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ProveNavigation extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $navigationId,
        public int $expectedRowVersion,
        public NavigationCompletion $completes,
        public string $proof,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
