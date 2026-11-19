<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Grammar\FinishAndOr;
use App\Processes\Pipes\Grammar\ReadFirstAndOrPart;
use App\Processes\Pipes\Grammar\ReadLinkedAndOrPart;
use App\Processes\Pipes\Grammar\StepPastAndOr;
use App\Processes\Values\Grammar\AndOrChain;

/**
 * and_or := pipeline ((&& | ||) pipeline)*, joined from the left.
 */
final readonly class ReadAndOrPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ReadFirstAndOrPart::class,
            Step::repeated(
                [StepPastAndOr::class, ReadLinkedAndOrPart::class],
                while: fn (AndOrChain $chain) => $chain->isAtAndOr(),
            ),
            FinishAndOr::class,
        ];
    }
}
