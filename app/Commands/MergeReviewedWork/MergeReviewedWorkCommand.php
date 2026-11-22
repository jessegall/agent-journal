<?php

declare(strict_types=1);

namespace App\Commands\MergeReviewedWork;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\MergeOutcome;

/**
 * The holder of a merge ask merges the exact head its approval names onto the integration branch, once: a replay
 * answers the same attempt, and no second git effect runs.
 *
 * @extends Command<MergeOutcome>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class MergeReviewedWorkCommand extends Command
{
    public function __construct(public string $decisionId, public int $expectedVersion) {}
}
