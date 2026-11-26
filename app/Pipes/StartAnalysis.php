<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\Lines\ShellSource;
use App\Processes\Grammar\Syntax\TreeDraft;
use App\Support\Lines\ShellLine;

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
