<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Handlers\RecordPhaseCheckHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;

/**
 * An agent or a user records the validated result of a check on a phase; only a current receipt newer than the
 * phase's last task change is accepted.
 *
 * @extends Command<string>
 */
#[HandledBy(RecordPhaseCheckHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
final readonly class RecordPhaseCheck extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $phaseId, public string $receiptId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
