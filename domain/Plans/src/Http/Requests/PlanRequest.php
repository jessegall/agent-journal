<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Http\Requests\Concerns\ReadsOutlinePages;
use Domain\Plans\Http\Requests\Concerns\ReadsPlanFilters;
use Domain\Plans\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The plan a record page shows, named by its route; by the record's number; a number no record has is not found. Its
 * query may ask for a page of the plan's outline.
 */
final class PlanRequest extends FormRequest
{
    use ReadsOutlinePages;
    use ReadsPlanFilters;
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            ...$this->outlinePageRules(),
            ...$this->planFilterRules(),
            'tab' => ['nullable', 'string', 'in:tasks,graph'],
            'node' => ['nullable', 'string', 'max:26'],
        ];
    }

    public function filters(): PlanFiltersData
    {
        return $this->planFilters();
    }

    /**
     * The tab the reader opened, Tasks when it opened none.
     */
    public function chosenTab(): string
    {
        $tab = $this->string('tab')->toString();

        return $tab === '' ? 'tasks' : $tab;
    }

    /**
     * The task node chosen in the graph, as the address a task leads back to carries it; '' when none is chosen.
     */
    public function selectedNode(): string
    {
        return $this->string('node')->toString();
    }

    public function planId(): string
    {
        return Plan::idOfNumber($this->routeNumber('plan')) ?? throw new NotFoundHttpException();
    }
}
