<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\MergeReviewedWorkHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Values\MergeOutcome;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * The holder of a merge ask merges the exact head its approval names onto the integration branch, once: a replay
 * answers the same attempt, and no second git effect runs.
 *
 * @extends Command<MergeOutcome>
 */
#[HandledBy(MergeReviewedWorkHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
#[Operation('publish_merge', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class MergeReviewedWork extends Command implements AuthorizedCommand
{
    public function __construct(public string $decisionId, public int $expectedVersion) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
