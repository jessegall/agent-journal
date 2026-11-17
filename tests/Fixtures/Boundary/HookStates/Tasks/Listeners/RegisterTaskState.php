<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\HookStates\Tasks\Listeners;

use Tests\Fixtures\Boundary\HookStates\Hooks\Events\StateTypesRequested;

final class RegisterTaskState
{
    public function handle(StateTypesRequested $event): void {}
}
