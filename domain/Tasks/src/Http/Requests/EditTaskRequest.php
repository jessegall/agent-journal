<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use Domain\Tasks\Commands\EditTask;
use Domain\Tasks\Support\TaskLimits;
use Illuminate\Foundation\Http\FormRequest;

/**
 * An edit of a task: the task, the revision the caller read, and a new title, brief or both.
 */
final class EditTaskRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'taskId' => ['required', 'ulid'],
            'expectedRevision' => ['required', 'integer', 'min:1'],
            'title' => ['required_without:brief', 'string', 'max:'.TaskLimits::TITLE_CHARACTERS],
            'brief' => ['required_without:title', 'string', 'max:'.TaskLimits::NOTE_CHARACTERS],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): EditTask
    {
        return new EditTask(
            $this->string('taskId')->value(),
            $this->integer('expectedRevision'),
            $this->filled('title') ? $this->string('title')->value() : null,
            $this->filled('brief') ? $this->string('brief')->value() : null,
        );
    }
}
