<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use App\Http\Requests\Concerns\ReadsIdempotencyKey;
use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Tasks\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A change of a task page's wait: the task by its route number, the other task by its number, the reason when the
 * wait is waived, and the request key the Idempotency-Key header carries.
 */
final class TaskWaitRequest extends FormRequest
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
            'prerequisite' => ['required', 'string', 'regex:/^[1-9][0-9]{0,18}$/'],
            'reason' => ['sometimes', 'string', 'max:'.Task::NOTE_CHARACTER_LIMIT],
        ];
    }

    public function taskId(): string
    {
        return Task::idOfNumber($this->routeNumber('task')) ?? throw new NotFoundHttpException();
    }

    public function prerequisiteId(): string
    {
        return Task::idOfNumber((int) $this->string('prerequisite')->toString()) ?? throw new NotFoundHttpException();
    }

    public function reason(): string
    {
        return trim($this->string('reason')->toString());
    }
}
