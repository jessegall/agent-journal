<?php

declare(strict_types=1);

namespace Domain\Plans\Api\Concerns;

use App\Records\Contracts\RecordResolver;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use App\Web\Exceptions\InvalidRecordReference;
use Domain\Plans\Models\Phase;
use Illuminate\Support\Str;

/**
 * A call about the work under one plan or phase, named by its type and its id or number; a phase number is counted
 * within its plan, which the call names by number too.
 */
trait NamesPlanWorkRoot
{
    /**
     * @throws InvalidRecordReference
     */
    public function rootRecord(RecordResolver $records): RecordIdentity
    {
        if (Str::isUlid($this->rootId)) {
            return new RecordIdentity($this->rootType, strtolower($this->rootId));
        }

        $number = RecordReference::number($this->rootId);

        if ($this->rootType !== 'plans.phase') {
            return $records->identify(RecordReference::of('plan', $number));
        }

        if ($this->rootPlan === null) {
            throw InvalidRecordReference::parentMissing('phase', 'plan');
        }

        $plan = $records->identify(RecordReference::of('plan', RecordReference::number($this->rootPlan)));

        return Phase::findNumberedInPlanId($plan->id, $number)->assignmentIdentity();
    }
}
