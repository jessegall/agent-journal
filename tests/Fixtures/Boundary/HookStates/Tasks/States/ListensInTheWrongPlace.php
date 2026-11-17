<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\HookStates\Tasks\States;

use Tests\Fixtures\Boundary\HookStates\Hooks\Events\StateTypesRequested;

final class ListensInTheWrongPlace
{
    public function handle(StateTypesRequested $event): void {}
}
