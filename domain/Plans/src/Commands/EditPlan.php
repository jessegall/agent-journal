<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Handlers\EditPlanHandler;

/**
 * Gives a plan a new title, brief or type, refused when the plan moved past the revision the caller read; answers
 * the new revision. What is left out stays as it is.
 *
 * @implements Command<int>
 */
#[HandledBy(EditPlanHandler::class)]
final readonly class EditPlan implements Command
{
    public function __construct(
        public string $planId,
        public int $expectedRevision,
        public string|null $title = null,
        public string|null $brief = null,
        public PlanType|null $type = null,
    ) {}
}
