<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\Lines\ReadSource;
use App\Processes\Grammar\ListRead;
use App\Values\AgentText;

/**
 * A source's list must reach the end of the source; what is left makes the line invalid.
 */
final readonly class RequireEndOfSource implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ListRead $listRead): ReadSource
    {
        $cursor = $listRead->context->cursor;

        if (! $cursor->isAtEnd()) {
            throw ShellGrammarStopped::invalid(
                AgentText::of('core.shell.unexpected', ['token' => $cursor->currentType()->value]),
                $cursor->position(),
            );
        }

        return new ReadSource($listRead->context->source, $listRead->parent);
    }
}
