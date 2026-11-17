<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Requests;

use App\Domain\Web\Data\HomeFiltersData;
use App\Domain\Web\Http\Requests\Concerns\ReadsPlanFilters;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Home's query: the plans slice's filters and the agent session the chat pane talks to.
 */
final class HomeRequest extends FormRequest
{
    use ReadsPlanFilters;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [...$this->planFilterRules(), 'session' => ['nullable', 'string', 'regex:/^[1-9][0-9]{0,18}$/']];
    }

    public function filters(): HomeFiltersData
    {
        return HomeFiltersData::from(array_filter([
            'plans' => $this->planFilters(),
            'session' => $this->filled('session') ? $this->string('session')->toString() : null,
        ], fn (mixed $value) => $value !== null));
    }
}
