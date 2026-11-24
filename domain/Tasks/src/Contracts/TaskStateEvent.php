<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use App\Attributes\TransactionListenerConsent;
use App\Contracts\Events\Event;
use Domain\Tasks\Enums\TaskState;

/**
 * A task moved into another state: started, finished, blocked or cancelled.
 */
#[TransactionListenerConsent]
interface TaskStateEvent extends Event
{
    public string $taskId { get; }

    public TaskState $previousState { get; }

    public string $historyEntryId { get; }

    /**
     * The state the task moved into.
     */
    public function enteredState(): TaskState;
}
