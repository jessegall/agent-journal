<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Http\Requests\Concerns\ReadsOutlinePages;
use Domain\Plans\Http\Requests\Concerns\ReadsPlanFilters;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The plans page's query: the plans slice's filters, and the page of the selected plan's outline its reader asks for.
 */
final class PlansRequest extends FormRequest
{
    use ReadsOutlinePages;
    use ReadsPlanFilters;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            ...$this->planFilterRules(),
            ...$this->outlinePageRules(),
        ];
    }

    public function filters(): PlanFiltersData
    {
        return $this->planFilters();
    }
}
