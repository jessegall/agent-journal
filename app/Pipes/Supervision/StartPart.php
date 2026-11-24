<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\PendingPart;
use App\Support\Execution\PendingStep;

/**
 * Lines up a part's command substitutions, which run before it.
 */
final readonly class StartPart implements Pipe
{
    public function handle(PendingStep $toRun): PendingPart
    {
        return $toRun->part();
    }
}
