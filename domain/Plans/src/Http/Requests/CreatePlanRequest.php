<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use Domain\Plans\Commands\CreatePlan;
use Domain\Plans\Enums\PlanType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A new plan's title, brief and type. Who calls comes from the signed credential alone, so a body naming an agent, a
 * session or an actor is refused.
 */
final class CreatePlanRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:240'],
            'brief' => ['required', 'string', 'max:8000'],
            'type' => ['required', Rule::enum(PlanType::class)],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): CreatePlan
    {
        return new CreatePlan($this->string('title')->value(), $this->string('brief')->value(), PlanType::from($this->string('type')->value()));
    }
}
