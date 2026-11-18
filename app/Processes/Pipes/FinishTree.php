<?php

declare(strict_types=1);

namespace App\Processes\Pipes;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Lines\ReadSource;
use App\Processes\Values\ShellTree;

/**
 * Turns the draft into the finished ShellTree, rooted at the whole line's sequence.
 */
final readonly class FinishTree implements Pipe
{
    public function handle(ReadSource $read): ShellTree
    {
        return $read->tree();
    }
}
