<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Plans\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A Suggest, Apply or Undo on the graph of the plan the route names; the graph's version it was read at comes along.
 */
final class PlanGraphRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'planId' => ['nullable', 'string', 'max:26'],
            'version' => ['nullable', 'string', 'max:64'],
            'baseVersion' => ['nullable', 'string', 'max:64'],
        ];
    }

    public function plan(): Plan
    {
        $plan = Plan::query()->find(Plan::idOfNumber($this->routeNumber('plan')));

        if ($plan === null) {
            throw new NotFoundHttpException();
        }

        return $plan;
    }
}
