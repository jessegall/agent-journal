<?php

declare(strict_types=1);

namespace Tests\Fixtures\Listeners;

use App\Contracts\Attributes\InCommandTransaction;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * A required listener that would leave the transaction for a queue.
 */
#[InCommandTransaction]
final class QueuedRequiredListener implements ShouldQueue
{
    public function handle(PlanProgressChanged $event): void {}
}
