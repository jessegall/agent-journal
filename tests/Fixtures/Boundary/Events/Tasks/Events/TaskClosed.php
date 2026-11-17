<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Tasks\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class TaskClosed
{
    use Dispatchable;

    public function __construct(public readonly int $taskId) {}
}
