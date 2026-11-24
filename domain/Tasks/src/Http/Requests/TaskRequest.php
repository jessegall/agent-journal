<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsCommentsPage;
use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Tasks\Exceptions\TaskPassageUnavailable;
use Domain\Tasks\Http\Requests\Concerns\ReadsTaskFilters;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Values\TaskBriefPassage;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The task a record page shows, named by its number in the route; a number no task has is not found. Its query may ask
 * for the task's Logs, with an older page, or a page of its Proofs.
 */
final class TaskRequest extends FormRequest
{
    use ReadsCommentsPage;
    use ReadsRouteNumber;
    use ReadsTaskFilters;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'section' => ['nullable', 'string', 'in:logs,proofs,waits'],
            'tab' => ['nullable', 'string', 'in:logs,proofs,waits,comments,brief'],
            'passage' => ['nullable', 'string', 'max:64'],
            'entry' => ['nullable', 'string', 'max:26'],
            'logs_before' => ['nullable', 'string', 'regex:/^(n|[0-9]{1,10}),(n|[0-9]{1,10})$/'],
            'proofs_after' => ['nullable', 'string', 'max:26'],
            'commentsAfter' => ['nullable', 'string', 'max:26'],
            'prerequisite_q' => ['nullable', 'string', 'max:200'],
            ...$this->filterRules(),
        ];
    }

    /**
     * The tab the reader opened, from its tab key or the section key a native reader used; Waits when it opened none.
     */
    public function chosenTab(): string
    {
        $tab = $this->string('tab')->toString();
        $section = $this->string('section')->toString();

        if ($tab !== '') {
            return $tab;
        }

        if ($section !== '') {
            return $section;
        }

        return 'waits';
    }

    /**
     * Whether the reader opened its Logs tab, so their newest page is read.
     */
    public function isAskingForLogs(): bool
    {
        return $this->chosenTab() === 'logs';
    }

    /**
     * Whether the reader opened its Waits tab, so the task's direct waits both ways are read.
     */
    public function isAskingForWaits(): bool
    {
        return $this->chosenTab() === 'waits';
    }

    /**
     * The words a prerequisite search asks for; '' when the reader searches nothing.
     */
    public function prerequisiteSearch(): string
    {
        return trim($this->string('prerequisite_q')->toString());
    }

    /**
     * Whether the reader opened its Proofs tab, so a page of them is read.
     */
    public function isAskingForProofs(): bool
    {
        return $this->chosenTab() === 'proofs';
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

    /**
     * The brief passage a search opened the task at; ask isAskingForPassage() first.
     *
     * @throws TaskPassageUnavailable
     */
    public function passage(): TaskBriefPassage
    {
        return TaskBriefPassage::fromId($this->string('passage')->toString());
    }

    public function isAskingForPassage(): bool
    {
        return $this->filled('passage');
    }

    /**
     * Whether a search opened the Logs tab at one log line.
     */
    public function isAskingForEntry(): bool
    {
        return $this->filled('entry');
    }

    /**
     * The log line a search opened the Logs tab at; ask isAskingForEntry() first.
     */
    public function entryId(): string
    {
        return $this->string('entry')->toString();
    }

    public function taskId(): string
    {
        return Task::idOfNumber($this->routeNumber('task')) ?? throw new NotFoundHttpException();
    }
}
