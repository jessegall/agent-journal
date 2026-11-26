<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipes\Supervision\BuiltinChecks\RefuseCdWithSeveralFolders;
use App\Pipes\Supervision\BuiltinChecks\RefuseEchoEscapes;
use App\Pipes\Supervision\BuiltinChecks\RefusePrintfConversions;
use App\Pipes\Supervision\BuiltinChecks\RefusePrintfWithoutFormat;
use App\Pipes\Supervision\FinishBackground;
use App\Pipes\Supervision\NotifyStop;
use App\Pipes\Supervision\RunRootStep;
use App\Pipes\Supervision\StartRun;
use App\Support\Execution\PlannedRun;
use App\Support\Execution\StepOutcome;

/**
 * Runs an execution plan: control flow decides which parts run, builtins run in the shell context, every external part
 * is spawned in its own process group with its own record, and background parts are waited for. A part that does not
 * run, or whose admission went stale, is recorded as skipped.
 *
 * @implements PipelineDefinition<PlannedRun, StepOutcome>
 */
final readonly class SuperviseRunPipeline implements PipelineDefinition
{
    public string $input = PlannedRun::class;

    public string $output = StepOutcome::class;

    public function pipes(): array
    {
        return [
            RefuseEchoEscapes::class,
            RefusePrintfWithoutFormat::class,
            RefusePrintfConversions::class,
            RefuseCdWithSeveralFolders::class,
            StartRun::class,
            RunRootStep::class,
            FinishBackground::class,
            NotifyStop::class,
        ];
    }
}
