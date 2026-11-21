<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * A queued public listener of a committed rename.
 */
final class QueuedRenameListener implements ShouldQueue
{
    public function handle(RowRenamed $event): void {}
}
