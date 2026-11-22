<?php

declare(strict_types=1);

namespace Tests\Fixtures\Listeners;

use App\Attributes\InCommandTransaction;
use Domain\Plans\Events\PlanProgressChanged;

/**
 * A Core listener the command's transaction requires.
 */
#[InCommandTransaction]
final class TransactionProgressListener
{
    public function handle(PlanProgressChanged $event): void {}
}
