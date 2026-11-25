<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Http\Requests\Concerns\ReadsOutlinePages;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The phase a phase page shows, named by its plan's number and its own number within that plan; a plan or phase
 * number no record has is not found.
 */
final class PhaseRequest extends FormRequest
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

    public function phase(): Phase
    {
        $plan = Plan::query()->find(Plan::idOfNumber($this->routeNumber('plan'))) ?? throw new NotFoundHttpException();

        try {
            $number = $this->routeNumber('phase');

            return Phase::findNumberedIn($plan, $number)->setRelation('plan', $plan);
        } catch (PhaseMissing $missingPhase) {
            throw new NotFoundHttpException(previous: $missingPhase);
        }
    }
}
