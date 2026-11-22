<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\AnalysisLimit;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\CompoundParts;
use App\Support\Grammar\CompoundToParse;

/**
 * Opens a subshell or group one level deeper, past its ( or {; a nesting past the depth limit stops the analysis.
 */
final readonly class OpenCompoundNode implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CompoundToParse $toParse): CompoundParts
    {
        $cursor = $toParse->cursor();

        if (AnalysisLimit::Depth->isPassedBy($toParse->depth + 1)) {
            throw ShellGrammarStopped::pastLimit(AnalysisLimit::Depth, $cursor->position());
        }

        $open = $cursor->current();
        $cursor->advance();
        $node = $toParse->draft()->add($toParse->type, $open->range, null);

        return new CompoundParts($toParse, $node, $open->range, []);
    }
}
