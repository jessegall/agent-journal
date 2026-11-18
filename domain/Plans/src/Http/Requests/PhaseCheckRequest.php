<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A phase named by its plan's number and its own, and the result receipt offered for it, if any.
 */
final class PhaseCheckRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'plan' => ['required', 'integer', 'min:1'],
            'phase' => ['required', 'integer', 'min:1'],
            'receipt' => ['nullable', 'string', 'max:26'],
        ];
    }

    public function phase(): Phase
    {
        $plan = Plan::query()->find(Plan::idOfNumber($this->integer('plan'))) ?? throw new NotFoundHttpException();

        try {
            return $plan->phaseNumbered($this->integer('phase'));
        } catch (PhaseMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }
    }

    public function receiptId(): string
    {
        return $this->string('receipt')->toString();
    }
}
