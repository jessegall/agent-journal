<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Grammar\CompleteAndOrChain;
use App\Processes\Pipes\Grammar\ParseFirstAndOrOperand;
use App\Processes\Pipes\Grammar\ParseNextAndOrOperand;
use App\Processes\Pipes\Grammar\SkipAndOrOperator;
use App\Processes\Values\Grammar\AndOrChain;

/**
 * and_or := pipeline ((&& | ||) pipeline)*, joined from the left.
 */
final readonly class ReadAndOrPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ParseFirstAndOrOperand::class,
            Step::repeated([SkipAndOrOperator::class, ParseNextAndOrOperand::class],
                while: fn (AndOrChain $chain) => $chain->isAtAndOr()
            ),
            CompleteAndOrChain::class,
        ];
    }
}
