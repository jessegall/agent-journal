<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Plans\Handlers\CancelPlanHandler;

/**
 * Cancels a plan with its reason; its tasks and assignments stay.
 *
 * @implements Command<null>
 */
#[HandledBy(CancelPlanHandler::class)]
final readonly class CancelPlan implements Command
{
    public function __construct(
        public string $planId,
        public int $expectedRevision,
        public string $reason,
    ) {}
}
