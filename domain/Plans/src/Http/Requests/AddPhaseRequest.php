<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use Domain\Plans\Commands\AddPhase;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A new phase's plan and title, appended after the plan's last phase. Who calls comes from the signed credential alone, so a body naming an agent, a
 * session or an actor is refused.
 */
final class AddPhaseRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'planId' => ['required', 'ulid'],
            'title' => ['required', 'string', 'max:240'],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): AddPhase
    {
        return new AddPhase($this->string('planId')->value(), $this->string('title')->value());
    }
}
