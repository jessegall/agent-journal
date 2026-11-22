<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\AcknowledgePresentation;
use App\Communication\Data\PresentationItemData;
use App\Communication\Support\PresentationBatches;
use Carbon\CarbonImmutable;

/**
 * Presents an agent's unread chat text to its driver and confirms every piece, as a driver that showed all of it
 * would; the test runs it as that agent's session.
 */
trait PresentsChatText
{
    protected function presentAll(ActorIdentity $agent, string $sessionId, string $contextKey = 'thread-1'): void
    {
        $batch = $this->app->make(PresentationBatches::class)
            ->next($agent, $sessionId, 1, $contextKey, CarbonImmutable::now());

        if ($batch === null) {
            return;
        }

        $this->runOnBus(new AcknowledgePresentation(
            $batch->batchId,
            array_map(fn (PresentationItemData $item) => $item->handle, $batch->items),
            $contextKey,
        ));
    }
}
