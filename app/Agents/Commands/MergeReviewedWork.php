<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\MergeReviewedWorkHandler;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Values\MergeOutcome;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * The holder of a merge ask merges the exact head its approval names onto the integration branch, once: a replay
 * answers the same attempt, and no second git effect runs.
 *
 * @extends Command<MergeOutcome>
 */
#[HandledBy(MergeReviewedWorkHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class MergeReviewedWork extends Command
{
    public function __construct(public string $decisionId, public int $expectedVersion) {}
}
