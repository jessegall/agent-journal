<?php

declare(strict_types=1);

namespace App\Support\Grammar;

use App\Support\Lines\ShellSource;
use App\Support\Syntax\TokenCursor;
use App\Support\Syntax\TreeDraft;

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
