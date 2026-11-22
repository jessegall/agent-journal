<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Tasks\Events;

use App\Contracts\Events\Event;
use Illuminate\Foundation\Events\Dispatchable;

final class TaskClosed implements Event
{
    use Dispatchable;

    public function __construct(public readonly int $taskId) {}
}
