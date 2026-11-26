<?php

declare(strict_types=1);

namespace Domain\Plans\Contracts;

use App\CommandRules\Enums\ReadView;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Values\PhaseDetails;
use Domain\Plans\Values\PlanDetails;

/**
 * One plan or one phase for whoever acts in this request, with Plans' own progress; every actor reads every plan.
 */
interface PlanDetailsResolver
{
    public const int TASKS_PER_READ = 50;

    /**
     * The plan with the task references of its phases from the offset, at most 50.
     *
     * @throws PlanMissing
     */
    public function plan(string $planId, ReadView $view, int $taskOffset = 0): PlanDetails;

    /**
     * @throws PhaseMissing
     */
    public function phase(string $phaseId): PhaseDetails;
}
