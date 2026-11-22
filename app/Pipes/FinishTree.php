<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Support\Lines\ReadSource;
use App\Values\ShellTree;

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
