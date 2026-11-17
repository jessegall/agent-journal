<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Requests;

use App\Domain\Web\Data\PlanFiltersData;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The plans page's query: search words up to 200 characters, a page from 1, and an optional selected plan id.
 */
final class PlansRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['nullable', 'integer', 'min:1'],
            'plan' => ['nullable', 'string', 'regex:/^[1-9][0-9]{0,18}$/'],
        ];
    }

    /**
     * An empty search arrives as null after Laravel's empty-string conversion; it means no search words.
     */
    public function filters(): PlanFiltersData
    {
        return PlanFiltersData::from(array_filter([
            'q' => $this->string('q')->toString(),
            'page' => $this->integer('page', 1),
            'plan' => $this->filled('plan') ? $this->string('plan')->toString() : null,
        ], fn (mixed $value) => $value !== null));
    }
}
