<?php

declare(strict_types=1);

namespace App\Processes\Pipes;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\AnalysisLimit;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Values\Lines\ShellSource;

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
