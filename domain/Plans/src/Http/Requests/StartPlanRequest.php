<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Plans\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Which plan to start, named by the route; by the record's number; a number no record has is not found.
 */
final class StartPlanRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function planId(): string
    {
        return Plan::idOfNumber($this->routeNumber('plan')) ?? throw new NotFoundHttpException;
    }
}
