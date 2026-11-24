<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Supervision\BuiltinChecks\RefuseCdWithSeveralFolders;
use App\Pipes\Supervision\BuiltinChecks\RefuseEchoEscapes;
use App\Pipes\Supervision\BuiltinChecks\RefusePrintfConversions;
use App\Pipes\Supervision\BuiltinChecks\RefusePrintfWithoutFormat;
use App\Pipes\Supervision\FinishBackground;
use App\Pipes\Supervision\ReportStop;
use App\Pipes\Supervision\RunRootStep;
use App\Pipes\Supervision\StartRun;
use App\Support\Execution\RunToSupervise;
use App\Support\Execution\StepOutcome;

/**
 * Runs an execution plan step by step: control flow decides which parts run, builtins run in the shell context, every
 * external part is spawned from its argv in its own process group with its own record and its own end, and background
 * parts are waited for before the run ends. A part that does not run because of an earlier result, or whose admission
 * went stale, is recorded as skipped, never left out.
 *
 * @implements PipelineDefinition<RunToSupervise, StepOutcome>
 */
final readonly class SuperviseRunPipeline implements PipelineDefinition
{
    public string $input = RunToSupervise::class;

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
            ReportStop::class,
        ];
    }
}
