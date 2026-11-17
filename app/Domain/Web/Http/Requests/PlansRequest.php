<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Requests;

use App\Domain\Web\Data\PlanFiltersData;
use App\Domain\Web\Http\Requests\Concerns\ReadsPlanFilters;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The plans page's query: the plans slice's filters.
 */
final class PlansRequest extends FormRequest
{
    use ReadsPlanFilters;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return $this->planFilterRules();
    }

    public function filters(): PlanFiltersData
    {
        return $this->planFilters();
    }
}
