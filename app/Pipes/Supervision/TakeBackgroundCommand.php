<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Enums\StepType;
use App\Exceptions\SupervisorRefused;
use App\Support\Execution\PartToRun;
use App\Support\Execution\StepToRun;

/**
 * The one plain command a background step runs; anything else in the background is refused.
 */
final readonly class TakeBackgroundCommand implements Pipe
{
    public function handle(StepToRun $toRun): PartToRun
    {
        $child = $toRun->firstChild();

        if ($child->step->type !== StepType::Command || $child->step->children !== []) {
            throw SupervisorRefused::stepNotRun($child->step->type);
        }

        return $child->part();
    }
}
