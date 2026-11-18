<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use Domain\Plans\Commands\CancelPlan;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A cancel of a plan: the plan, the revision the caller read, and the reason. Who calls comes from the signed credential alone.
 */
final class CancelPlanRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'planId' => ['required', 'ulid'],
            'expectedRevision' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'max:8000'],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): CancelPlan
    {
        return new CancelPlan($this->string('planId')->value(), $this->integer('expectedRevision'), $this->string('reason')->value());
    }
}
