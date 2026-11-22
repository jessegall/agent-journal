<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\RequestPlanReview;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Puts a planned plan up for review by its reviewers, one or more: the plan reads Reviewing, and neither it, its phases nor its
 * tasks change until the review is decided or withdrawn; a reviewing plan does not start.
 *
 * @extends Command<string>
 */
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class RequestPlanReviewCommand extends Command
{
    /**
     * @param  non-empty-list<ActorIdentity>  $reviewers
     */
    public function __construct(public string $planId, public array $reviewers) {}
}
