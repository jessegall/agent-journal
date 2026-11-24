<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\ListRead;
use App\Support\Lines\ReadSource;
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

        if (! $cursor->atEnd()) {
            throw ShellGrammarStopped::invalid(
                AgentText::of('core.shell.unexpected', ['token' => $cursor->currentType()->value]),
                $cursor->position(),
            );
        }

        return new ReadSource($listRead->context->source, $listRead->parent);
    }
}
