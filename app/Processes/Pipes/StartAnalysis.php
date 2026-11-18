<?php

declare(strict_types=1);

namespace App\Processes\Pipes;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Syntax\TreeDraft;
use App\Processes\Values\Lines\ShellLine;
use App\Processes\Values\Lines\ShellSource;

/**
 * Opens a fresh draft for the line and makes the whole line the first source, at depth 0 with no parent.
 */
final readonly class StartAnalysis implements Pipe
{
    public function handle(ShellLine $line): ShellSource
    {
        return new ShellSource($line->line, 0, 0, null, new TreeDraft($line->line, $line->dialect));
    }
}
