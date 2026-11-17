<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Requests;

use App\Core\Assignments\Support\NumberedPage;
use App\Domain\Plans\Api\AssignedPlanFilters;
use App\Domain\Plans\Enums\PlanState;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The calling agent's plans list query: search words, states, a page from 1 and a page size from 1 to 100. Who calls
 * comes from the signed credential alone, so a body naming an agent, a session or an actor is refused.
 */
final class AssignedPlansRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:200'],
            'states' => ['array'],
            'states.*' => [Rule::enum(PlanState::class)],
            'page' => ['integer', 'min:1'],
            'perPage' => ['integer', 'min:1', 'max:'.NumberedPage::LARGEST_SIZE],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function filters(): AssignedPlanFilters
    {
        return new AssignedPlanFilters(
            search: $this->string('search')->toString(),
            states: array_values($this->enums('states', PlanState::class)),
            page: new NumberedPage($this->integer('page', 1), $this->integer('perPage', 20)),
        );
    }
}
