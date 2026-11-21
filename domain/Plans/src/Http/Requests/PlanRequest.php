<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Plans\Http\Requests\Concerns\ReadsOutlinePages;
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
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return $this->outlinePageRules();
    }

    public function planId(): string
    {
        return Plan::idOfNumber($this->routeNumber('plan')) ?? throw new NotFoundHttpException();
    }
}
