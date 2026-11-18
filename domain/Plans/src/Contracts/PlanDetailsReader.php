<?php

declare(strict_types=1);

namespace Domain\Plans\Contracts;

use Domain\Plans\Api\PhaseDetails;
use Domain\Plans\Api\PlanDetails;
use Domain\Plans\Enums\PlanView;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\PlanMissing;

/**
 * One plan or one phase for whoever acts in this request, with Plans' own progress; every actor reads every plan.
 */
interface PlanDetailsReader
{
    public const int TASKS_PER_READ = 50;

    /**
     * The plan with the task references of its phases from the offset, at most 50.
     *
     * @throws PlanMissing
     */
    public function plan(string $planId, PlanView $view, int $taskOffset = 0): PlanDetails;

    /**
     * @throws PhaseMissing
     */
    public function phase(string $phaseId): PhaseDetails;
}
