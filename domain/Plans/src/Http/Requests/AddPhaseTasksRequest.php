<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use Domain\Plans\Commands\AddPhaseTasks;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Tasks to put at the end of a phase, with the phase revision the caller read. Who calls comes from the signed credential alone, so a body naming an agent, a
 * session or an actor is refused.
 */
final class AddPhaseTasksRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'phaseId' => ['required', 'ulid'],
            'expectedRevision' => ['required', 'integer', 'min:1'],
            'taskIds' => ['required', 'array', 'min:1', 'max:100'],
            'taskIds.*' => ['ulid'],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): AddPhaseTasks
    {
        return new AddPhaseTasks($this->string('phaseId')->value(), $this->integer('expectedRevision'), array_values(array_map(strval(...), $this->array('taskIds'))));
    }
}
