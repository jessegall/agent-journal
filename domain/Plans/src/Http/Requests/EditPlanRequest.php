<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use Domain\Plans\Commands\EditPlan;
use Domain\Plans\Enums\PlanType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * An edit of a plan: the plan, the revision the caller read, and a new title, brief or type. Who calls comes from the signed credential alone, so a body naming an agent, a
 * session or an actor is refused.
 */
final class EditPlanRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'planId' => ['required', 'ulid'],
            'expectedRevision' => ['required', 'integer', 'min:1'],
            'title' => ['required_without_all:brief,type', 'string', 'max:240'],
            'brief' => ['string', 'max:8000'],
            'type' => [Rule::enum(PlanType::class)],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): EditPlan
    {
        return new EditPlan(
            $this->string('planId')->value(),
            $this->integer('expectedRevision'),
            $this->filled('title') ? $this->string('title')->value() : null,
            $this->filled('brief') ? $this->string('brief')->value() : null,
            $this->enum('type', PlanType::class),
        );
    }
}
