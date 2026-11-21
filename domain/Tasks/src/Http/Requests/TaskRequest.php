<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Tasks\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The task a record page shows, named by its number in the route; a number no task has is not found. Its query may ask
 * for the task's Logs, with an older page, or a page of its Proofs.
 */
final class TaskRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'section' => ['nullable', 'string', 'in:logs,proofs'],
            'logs_before' => ['nullable', 'string', 'regex:/^(n|[0-9]{1,10}),(n|[0-9]{1,10})$/'],
            'proofs_after' => ['nullable', 'string', 'max:26'],
        ];
    }

    /**
     * Whether the reader opened its Logs tab, so their newest page is read.
     */
    public function asksForLogs(): bool
    {
        return $this->string('section')->toString() === 'logs';
    }

    /**
     * Whether the reader opened its Proofs tab, so a page of them is read.
     */
    public function asksForProofs(): bool
    {
        return $this->string('section')->toString() === 'proofs';
    }

    /**
     * The cursor of the older Logs page the reader asked for; '' when it asked for none.
     */
    public function logsBefore(): string
    {
        return $this->string('logs_before')->toString();
    }

    /**
     * The proof after which the reader asked for the next page; '' for the newest.
     */
    public function proofsAfter(): string
    {
        return $this->string('proofs_after')->toString();
    }

    public function taskId(): string
    {
        return Task::idOfNumber($this->routeNumber('task')) ?? throw new NotFoundHttpException();
    }
}
