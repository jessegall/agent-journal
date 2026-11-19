<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\AnalysisLimit;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Values\Grammar\CompoundParts;
use App\Processes\Values\Grammar\CompoundReading;

/**
 * Opens a subshell or group one level deeper, past its ( or {; a nesting past the depth limit stops the analysis.
 */
final readonly class OpenCompoundNode implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CompoundReading $reading): CompoundParts
    {
        $cursor = $reading->cursor();
        if (AnalysisLimit::Depth->isPassedBy($reading->depth + 1)) {
            throw ShellGrammarStopped::pastLimit(AnalysisLimit::Depth, $cursor->position());
        }
        $open = $cursor->current();
        $cursor->advance();
        $node = $reading->draft()->add($reading->type, $open->range, null);

        return new CompoundParts($reading, $node, $open->range, []);
    }
}
