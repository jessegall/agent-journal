<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Enums\CommandRules\NodeType;
use App\Pipelines\ReadCompoundPipeline;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\UnparsedCompound;
use App\Support\Grammar\UnparsedFunction;
use App\Support\PipelineAdapter;
use App\Values\AgentText;
use App\Values\SourceRange;

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
