<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Syntax\TokenCursor;
use App\Processes\Syntax\TreeDraft;
use App\Processes\Values\Lines\ShellSource;

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
