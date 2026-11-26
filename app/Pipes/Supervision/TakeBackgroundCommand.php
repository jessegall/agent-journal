<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\StepType;
use App\Processes\Exceptions\SupervisorRefused;
use App\Support\Execution\PendingPart;
use App\Support\Execution\PendingStep;

/**
 * The one plain command a background step runs; anything else in the background is refused.
 */
final readonly class TakeBackgroundCommand implements Pipe
{
    public function handle(PendingStep $toRun): PendingPart
    {
        $child = $toRun->firstChild();

        if ($child->step->type !== StepType::Command || $child->step->children !== []) {
            throw SupervisorRefused::stepNotRun($child->step->type);
        }

        return $child->part();
    }
}
