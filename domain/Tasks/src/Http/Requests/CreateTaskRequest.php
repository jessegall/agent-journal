<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Support\TaskLimits;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A new task's title and brief. Who creates it comes from the signed credential alone, so a body naming an agent, a
 * session or an actor is refused.
 */
final class CreateTaskRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:'.TaskLimits::TITLE_CHARACTERS],
            'brief' => ['required', 'string', 'max:'.TaskLimits::NOTE_CHARACTERS],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): CreateTask
    {
        return new CreateTask($this->string('title')->value(), $this->string('brief')->value());
    }
}
