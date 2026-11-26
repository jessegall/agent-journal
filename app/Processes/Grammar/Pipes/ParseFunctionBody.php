<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\CommandRules\Enums\NodeType;
use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipelines\ReadCompoundPipeline;
use App\Processes\Grammar\UnparsedCompound;
use App\Processes\Grammar\UnparsedFunction;
use App\Processes\Grammar\Values\SourceRange;
use App\Values\AgentText;

/**
 * A function definition is not supported, but its body must still be a complete group or subshell: the body is read
 * through the compound pipeline to check it, and the definition becomes one Unsupported node over it.
 *
 * @extends PipelineAdapter<UnparsedFunction, NodeRead>
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

    protected function into(object $input): UnparsedCompound
    {
        return $input->toParse->compound();
    }

    protected function back(object $parsedBody, object $input): NodeRead
    {
        $draft = $input->toParse->draft();
        $range = new SourceRange($input->start, $draft->range($parsedBody->node)->end);
        $definition = $draft->add(NodeType::Unsupported, $range, null);
        $draft->adopt($definition, $parsedBody->node);
        $draft->markUnsupported(AgentText::of('core.shell.function_unsupported'), $input->start);

        return new NodeRead($definition);
    }
}
