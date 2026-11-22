<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Sharing\Concerns\ReadsIdempotencyKey;
use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Plans\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A review action on the plan page: the plan by its route number, the edition the decider read, the reason of a
 * request for changes, and the request key the Idempotency-Key header carries.
 */
final class PlanReviewRequest extends FormRequest
{
    use ReadsIdempotencyKey;
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            ...$this->idempotencyKeyRules(),
            'edition' => ['sometimes', 'integer', 'min:1'],
            'reason' => ['sometimes', 'string', 'max:'.Plan::NOTE_CHARACTER_LIMIT],
        ];
    }

    public function planId(): string
    {
        return Plan::idOfNumber($this->routeNumber('plan')) ?? throw new NotFoundHttpException();
    }

    public function editionNumber(): int
    {
        return $this->integer('edition');
    }

    public function reason(): string
    {
        return trim($this->string('reason')->toString());
    }
}
