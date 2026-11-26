<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\AnalysisLimit;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\CompoundParts;
use App\Processes\Grammar\UnparsedCompound;

/**
 * Opens a subshell or group one level deeper, past its ( or {; a nesting past the depth limit stops the analysis.
 */
final readonly class OpenCompoundNode implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(UnparsedCompound $toParse): CompoundParts
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
