<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Grammar\AndOrChain;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipes\CompleteAndOrChain;
use App\Processes\Grammar\Pipes\ParseFirstAndOrOperand;
use App\Processes\Grammar\Pipes\ParseNextAndOrOperand;
use App\Processes\Grammar\Pipes\SkipAndOrOperator;
use App\Processes\Grammar\UnparsedNode;

/**
 * and_or := pipeline ((&& | ||) pipeline)*, joined from the left.
 *
 * @implements PipelineDefinition<UnparsedNode, NodeRead>
 */
final readonly class ReadAndOrPipeline implements PipelineDefinition
{
    public string $input = UnparsedNode::class;

    public string $output = NodeRead::class;

    public function pipes(): array
    {
        return [
            ParseFirstAndOrOperand::class,
            Step::repeated(
                [SkipAndOrOperator::class, ParseNextAndOrOperand::class],
                while: fn (AndOrChain $chain) => $chain->isAtAndOr()
            ),
            CompleteAndOrChain::class,
        ];
    }
}
