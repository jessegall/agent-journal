<?php

declare(strict_types=1);

namespace Tests\Fixtures\Listeners;

use App\Attributes\InCommandTransaction;
use Domain\Plans\Events\PlanProgressChanged;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * A required listener that would leave the transaction for a queue.
 */
#[InCommandTransaction]
final class QueuedRequiredListener implements ShouldQueue
{
    public function handle(PlanProgressChanged $event): void {}
}
