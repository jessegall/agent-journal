<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\SimpleCommandDraft;
use App\Support\Syntax\UnsupportedConstructs;
use App\Values\AgentText;

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

            return new NodeRead($this->unsupported->skip(
                $context,
                AgentText::of('core.shell.array_assignment_unsupported'),
                null,
            ));
        }

        if ($parts->isEmpty() && ! $context->draft->hasChildren($parts->node)) {
            throw ShellGrammarStopped::invalid(AgentText::of('core.shell.command_missing'), $parts->start);
        }

        $context->draft->finish($parts->node, $parts->range(), $parts->arguments, $parts->redirects);

        return new NodeRead($parts->node);
    }
}
