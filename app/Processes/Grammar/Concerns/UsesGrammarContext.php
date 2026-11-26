<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Concerns;

use App\Processes\Grammar\Syntax\TreeDraft;
use App\Support\Syntax\TokenCursor;

/**
 * The cursor and draft of a grammar value's context, for the values that carry one.
 */
trait UsesGrammarContext
{
    public function cursor(): TokenCursor
    {
        return $this->context->cursor;
    }

    public function draft(): TreeDraft
    {
        return $this->context->draft;
    }
}
