<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Puts a planned plan up for review: its content is frozen as an edition and the plan reads Reviewing until the
 * review is decided or withdrawn; a reviewing plan does not start.
 *
 * @extends Command<string>
 */
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class RequestPlanReview extends Command
{
    public function __construct(public string $planId) {}
}
