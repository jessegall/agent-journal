<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Grammar\CompleteAndOrChain;
use App\Pipes\Grammar\ParseFirstAndOrOperand;
use App\Pipes\Grammar\ParseNextAndOrOperand;
use App\Pipes\Grammar\SkipAndOrOperator;
use App\Support\Grammar\AndOrChain;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\UnparsedNode;
use App\Support\Step;

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
