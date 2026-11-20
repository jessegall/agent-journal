<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\UnsupportedConstructs;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\SimpleCommandDraft;

/**
 * Finishes a simple command's node with its range, arguments and redirects; a command turned into an array assignment
 * gives way to one Unsupported node, and a command with nothing in it makes the line invalid.
 */
final readonly class CloseSimpleCommandNode implements Pipe
{
    public function __construct(private UnsupportedConstructs $unsupported) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(SimpleCommandDraft $command): NodeRead
    {
        $context = $command->toParse->context;
        $parts = $command->parts;

        if ($command->isArrayAssignment) {
            $context->draft->undoExecutablePartCount();
            $context->draft->remove($parts->node);

            return new NodeRead($this->unsupported->skip($context, 'An array assignment is not supported.', null));
        }

        if ($parts->isEmpty() && ! $context->draft->hasChildren($parts->node)) {
            throw ShellGrammarStopped::invalid('A command is missing here.', $parts->start);
        }
        $context->draft->finish($parts->node, $parts->range(), $parts->arguments, $parts->redirects);

        return new NodeRead($parts->node);
    }
}
