<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use Domain\Plans\Commands\FinishPlan;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A finish of a plan: the plan, the revision the caller read, and the note. Who calls comes from the signed credential alone.
 */
final class FinishPlanRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'planId' => ['required', 'ulid'],
            'expectedRevision' => ['required', 'integer', 'min:1'],
            'note' => ['required', 'string', 'max:8000'],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): FinishPlan
    {
        return new FinishPlan($this->string('planId')->value(), $this->integer('expectedRevision'), $this->string('note')->value());
    }
}
