<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed;

/**
 * A Plans listener that claims the transaction of a Tasks fact that does not declare it.
 */
#[InCommandTransaction]
final class TransactionCloseListener
{
    public function handle(TaskClosed $event): void {}
}
