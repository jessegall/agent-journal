<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ReadCompoundPipeline;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\CompoundReading;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\SourceRange;

/**
 * A function definition is not supported, but its body must still be a complete group or subshell: the body is read
 * through the compound pipeline to check it, and the definition becomes one Unsupported node.
 */
final readonly class FunctionDefinitions
{
    public function __construct(private Pipelines $pipelines) {}

    /**
     * @param  int  $headerTokens  how many tokens come before the body: the name, (), and the function keyword
     *
     * @throws ShellGrammarStopped
     */
    public function read(CommandReading $reading, int $headerTokens): int
    {
        $cursor = $reading->cursor();
        $draft = $reading->draft();
        $start = $cursor->position();
        for ($skipped = 0; $skipped < $headerTokens; $skipped++) {
            $cursor->advance();
        }
        $cursor->skip(TokenType::Newline);
        if (! CompoundReading::opensAt($cursor)) {
            throw ShellGrammarStopped::invalid('A function definition has no body.', $start);
        }
        $body = $this->pipelines->run(ReadCompoundPipeline::class, $reading->compound(), NodeRead::class)->node;
        $definition = $draft->add(NodeType::Unsupported, new SourceRange($start, $draft->range($body)->end), null);
        $draft->adopt($definition, $body);
        $draft->markUnsupported('A function definition is not supported.', $start);

        return $definition;
    }
}
