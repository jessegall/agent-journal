<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use Domain\Tasks\Models\Task;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A new task from the create dialog: its title, and its brief, what must be true when it is done.
 */
final class CreateTaskRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:'.Task::TITLE_CHARACTER_LIMIT],
            'brief' => ['required', 'string', 'max:'.Task::NOTE_CHARACTER_LIMIT],
        ];
    }

    public function title(): string
    {
        return $this->string('title')->toString();
    }

    public function brief(): string
    {
        return $this->string('brief')->toString();
    }
}
