<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Attributes\RequiresTransactionListener;
use App\Contracts\Events\Event;

/**
 * A task got a new title and brief, raised by the task inside the transaction that changed it, so Plans can refuse
 * the change while the task's plan is under review; its listener is named as text so Tasks does not depend on Plans.
 */
#[RequiresTransactionListener('Domain\Plans\Listeners\RefuseTaskChangeUnderReview')]
final readonly class TaskDescribed implements Event
{
    public function __construct(public string $taskId) {}
}
