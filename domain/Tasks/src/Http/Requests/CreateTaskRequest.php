<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use App\Http\Requests\Concerns\ReadsChosenProject;
use Domain\Tasks\Models\Task;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A new task from the create dialog: its title, its brief, what must be true when it is done, and under All projects
 * the project it goes to.
 */
final class CreateTaskRequest extends FormRequest
{
    use ReadsChosenProject;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:'.Task::TITLE_CHARACTER_LIMIT,
            ],
            'brief' => [
                'required',
                'string',
                'max:'.Task::NOTE_CHARACTER_LIMIT,
            ],
            ...$this->projectRules(),
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
