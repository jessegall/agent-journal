<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\CompoundParts;
use App\Values\AgentText;
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
            throw ShellGrammarStopped::invalid(
                AgentText::of('core.shell.not_closed', ['construct' => $reading->name()]),
                $start,
            );
        }

        $end = $cursor->currentEnd();
        $cursor->advance();

        return $parts->closedAt(new SourceRange($start, $end));
    }
}
