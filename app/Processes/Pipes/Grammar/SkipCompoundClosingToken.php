<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Values\Grammar\CompoundParts;
use App\Processes\Values\SourceRange;

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
