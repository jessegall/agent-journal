<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\AnalysisLimit;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\Lines\ShellSource;

/**
 * Stops a source nested deeper than the analysis allows, before anything of it is read.
 */
final readonly class GuardDepth implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ShellSource $source): ShellSource
    {
        if (AnalysisLimit::Depth->isPassedBy($source->depth)) {
            throw ShellGrammarStopped::pastLimit(AnalysisLimit::Depth, $source->offset);
        }

        return $source;
    }
}
