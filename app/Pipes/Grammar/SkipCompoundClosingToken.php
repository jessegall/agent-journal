<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\CompoundParts;
use App\Values\SourceRange;

/**
 * Steps past the ) or } that closes a subshell or group; a missing one makes the line invalid.
 */
final readonly class SkipCompoundClosingToken implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CompoundParts $parts): CompoundParts
    {
        $reading = $parts->toParse;
        $cursor = $reading->cursor();
        $start = $parts->range->start + $cursor->offset();

        if (! $cursor->is($reading->closing)) {
            throw ShellGrammarStopped::invalid("The {$reading->name()} opened here is not closed.", $start);
        }

        $end = $cursor->currentEnd();
        $cursor->advance();

        return $parts->closedAt(new SourceRange($start, $end));
    }
}
