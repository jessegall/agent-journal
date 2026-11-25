<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Runs\LifecycleStatus;

/**
 * Proof that a run started: its run id, the output number it writes to and its lifecycle. It never says how the run
 * ended or whether it passed.
 */
final readonly class RunReceipt
{
    public function __construct(public string $runId, public int $outputNumber, public LifecycleStatus $lifecycle) {}
}
