<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use Domain\Plans\Commands\CancelPlan;
use Domain\Plans\Commands\FinishPlan;
use Domain\Plans\Enums\PlanEndType;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A finish or cancel of a plan: the plan, the revision the caller read, and the note or reason the route's end type
 * asks for. Who calls comes from the signed credential alone.
 */
final class EndPlanRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'planId' => ['required', 'ulid'],
            'expectedRevision' => ['required', 'integer', 'min:1'],
            $this->endType()->textField() => ['required', 'string', 'max:8000'],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): CancelPlan|FinishPlan
    {
        return $this->endType()->command(
            $this->string('planId')->value(),
            $this->integer('expectedRevision'),
            $this->string($this->endType()->textField())->value(),
        );
    }

    private function endType(): PlanEndType
    {
        return PlanEndType::from((string) $this->route('ending'));
    }
}
