<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans\Listeners;

use App\Attributes\InCommandTransaction;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClaimed;

/**
 * A Plans listener the command's transaction requires for a Tasks fact, which Tasks declares.
 */
#[InCommandTransaction]
final class RequiredClaimListener
{
    public function handle(TaskClaimed $event): void {}
}
