<?php

declare(strict_types=1);

namespace App\Domain\Plans\Api\Events;

use App\Core\Ui\Contracts\ChangesWhatUsersSee;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A task in one of the plan's phases started, finished, was blocked or was cancelled, so the plan's progress moved.
 * Raised only once that change has committed.
 */
final readonly class PlanProgressChanged implements ChangesWhatUsersSee, ShouldDispatchAfterCommit
{
    public function __construct(public int $planId) {}
}
