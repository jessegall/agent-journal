<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Enums\NodeType;
use App\Processes\Pipelines\ReadCompoundPipeline;
use App\Processes\Values\Grammar\CompoundReading;
use App\Processes\Values\Grammar\FunctionReading;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\SourceRange;

/**
 * A function definition is not supported, but its body must still be a complete group or subshell: the body is read
 * through the compound pipeline to check it, and the definition becomes one Unsupported node over it.
 *
 * @extends PipelineAdapter<FunctionReading, NodeRead>
 */
final readonly class ParseFunctionBody extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadCompoundPipeline::class;
    }

    protected function produces(): string
    {
        return NodeRead::class;
    }

    protected function into(object $input): CompoundReading
    {
        return $input->reading->compound();
    }

    protected function back(object $result, object $input): NodeRead
    {
        $draft = $input->reading->draft();
        $range = new SourceRange($input->start, $draft->range($result->node)->end);
        $definition = $draft->add(NodeType::Unsupported, $range, null);
        $draft->adopt($definition, $result->node);
        $draft->markUnsupported('A function definition is not supported.', $input->start);

        return new NodeRead($definition);
    }
}
