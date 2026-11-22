<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Tasks\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A start, block or cancel from the task page: the task by its route number, the reason, and the revision and run the
 * reader read, so a task that moved on since is refused with its current state.
 */
final class TaskActionRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'reason' => ['sometimes', 'string', 'max:'.Task::NOTE_CHARACTER_LIMIT],
            'revision' => ['sometimes', 'integer', 'min:1'],
            'run' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function taskId(): string
    {
        return Task::idOfNumber($this->routeNumber('task')) ?? throw new NotFoundHttpException();
    }

    public function reason(): string
    {
        return $this->string('reason')->toString();
    }

    public function expectedRevision(): int
    {
        return $this->integer('revision');
    }

    public function expectedRunNumber(): int
    {
        return $this->integer('run');
    }
}
