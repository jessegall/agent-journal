<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Attributes\Listeners\TransactionListenerConsent;

/**
 * A task got a new title and brief, raised by the task inside the transaction that changed it, so Plans can refuse
 * the change while the task's plan is under review; its listener is named as text so Tasks does not depend on Plans.
 */
#[TransactionListenerConsent]
final readonly class TaskDescribed implements TaskEvent
{
    public function __construct(public string $taskId) {}
}
