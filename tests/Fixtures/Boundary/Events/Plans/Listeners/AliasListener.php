<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans\Listeners;

use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed as ClosedTask;

final class AliasListener
{
    public function handle(ClosedTask $event): void {}
}
