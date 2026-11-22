<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests;

use App\Assignments\Support\Page;
use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use App\Reads\Values\PageSize;
use Domain\Tasks\Http\Requests\Concerns\ReadsTaskFilters;
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
    use ReadsTaskFilters;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'section' => ['nullable', 'string', 'in:logs,proofs,waits'],
            'tab' => ['nullable', 'string', 'in:logs,proofs,waits'],
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

        return $tab !== '' ? $tab : ($section !== '' ? $section : 'waits');
    }

    /**
     * Whether the reader opened its Logs tab, so their newest page is read.
     */
    public function asksForLogs(): bool
    {
        return $this->chosenTab() === 'logs';
    }

    /**
     * Whether the reader opened its Waits tab, so the task's direct waits both ways are read.
     */
    public function asksForWaits(): bool
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
    public function asksForProofs(): bool
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
     * The page of the task's comments the reader asks for: after a comment, or from the first.
     */
    public function commentsPage(): Page
    {
        $after = $this->filled('commentsAfter') ? $this->string('commentsAfter')->toString() : null;

        return new Page($after, PageSize::from(null)->rows);
    }

    public function taskId(): string
    {
        return Task::idOfNumber($this->routeNumber('task')) ?? throw new NotFoundHttpException();
    }
}
