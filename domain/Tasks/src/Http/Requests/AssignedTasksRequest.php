<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use App\Assignments\Support\NumberedPage;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Enums\TaskState;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The calling agent's tasks list query: search words, states, a page from 1 and a page size from 1 to 100. Who calls
 * comes from the signed credential alone, so a body naming an agent, a session or an actor is refused.
 */
final class AssignedTasksRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:200'],
            'states' => ['array'],
            'states.*' => [Rule::enum(TaskState::class)],
            'page' => ['integer', 'min:1'],
            'perPage' => ['integer', 'min:1', 'max:'.NumberedPage::LARGEST_SIZE],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function filters(): TaskFilters
    {
        return new TaskFilters(
            search: $this->string('search')->toString(),
            states: array_values($this->enums('states', TaskState::class)),
            page: new NumberedPage($this->integer('page', 1), $this->integer('perPage', 20)),
        );
    }
}
