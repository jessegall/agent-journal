<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use Domain\Tasks\Http\Requests\Concerns\ReadsTaskFilters;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The tasks window's query: search words, a state, who holds the tasks, the page, and the chosen task's number.
 */
final class TasksRequest extends FormRequest
{
    use ReadsTaskFilters;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return $this->filterRules();
    }
}
