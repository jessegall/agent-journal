<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Enums\AnalysisLimit;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Lines\ShellSource;

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
