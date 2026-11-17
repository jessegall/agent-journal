<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans\Listeners;

use Tests\Fixtures\Boundary\Events\Tasks\{Events\TaskClosed, TasksDomain};

final class GroupListener
{
    public function handle(TaskClosed $event): string
    {
        return TasksDomain::class;
    }
}
