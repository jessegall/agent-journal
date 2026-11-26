<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\Processes\Grammar\Lines\ShellSource;
use App\Processes\Grammar\Syntax\TreeDraft;
use App\Support\Syntax\TokenCursor;

/**
 * What every grammar pipe of one source reads with: the source, its token cursor and the draft the nodes go into.
 */
final readonly class GrammarContext
{
    public TreeDraft $draft;

    public function __construct(public ShellSource $source, public TokenCursor $cursor)
    {
        $this->draft = $source->draft;
    }
}
