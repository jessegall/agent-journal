<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Cancelling or finishing a plan from its page: the plan by its route number, the revision and state the reader read,
 * and the reason or the finish note.
 */
final class PlanEndRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'revision' => ['required', 'integer', 'min:1'],
            'state' => ['required', Rule::enum(PlanStatus::class)],
            'text' => ['required', 'string', 'max:'.Plan::NOTE_CHARACTER_LIMIT],
        ];
    }

    public function planId(): string
    {
        return Plan::resolveIdOfNumber($this->routeNumber('plan')) ?? throw new NotFoundHttpException();
    }

    public function expectedRevision(): int
    {
        return $this->integer('revision');
    }

    public function expectedState(): PlanStatus
    {
        return $this->enum('state', PlanStatus::class) ?? throw new NotFoundHttpException();
    }

    public function text(): string
    {
        return trim($this->string('text')->toString());
    }
}
