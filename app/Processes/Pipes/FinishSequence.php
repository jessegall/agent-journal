<?php

declare(strict_types=1);

namespace App\Processes\Pipes;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Values\Grammar\ListRead;
use App\Processes\Values\Lines\ReadSource;

/**
 * A source's list must reach the end of the source; what is left makes the line invalid.
 */
final readonly class FinishSequence implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ListRead $list): ReadSource
    {
        $cursor = $list->context->cursor;
        if (! $cursor->atEnd()) {
            throw ShellGrammarStopped::invalid("Unexpected {$cursor->currentType()->value}.", $cursor->position());
        }

        return new ReadSource($list->context->source, $list->parent);
    }
}
