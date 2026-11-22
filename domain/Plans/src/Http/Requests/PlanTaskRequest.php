<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Http\Requests\Concerns\ReadsPlanFilters;
use Domain\Plans\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A task opened inside its plan, both named by their numbers in the route, with the plan page's own query carried along
 * so Back to the plan restores its tab, page and node.
 */
final class PlanTaskRequest extends FormRequest
{
    use ReadsPlanFilters;
    use ReadsRouteNumber;

    private const array RETURN_KEYS = [
        'tab', 'node', 'phase', 'phases_after', 'tasks_after', 'revision', 'q', 'page', 'state',
    ];

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

    public function planNumber(): int
    {
        return $this->routeNumber('plan');
    }

    public function taskNumber(): int
    {
        return $this->routeNumber('task');
    }

    public function planId(): string
    {
        return Plan::idOfNumber($this->planNumber()) ?? throw new NotFoundHttpException();
    }

    /**
     * The plan page's own query that was carried here, kept for the way back.
     *
     * @return array<string, string>
     */
    public function returnQuery(): array
    {
        return array_filter(
            array_map(strval(...), $this->only(self::RETURN_KEYS)),
            fn (string $value) => $value !== '',
        );
    }
}
