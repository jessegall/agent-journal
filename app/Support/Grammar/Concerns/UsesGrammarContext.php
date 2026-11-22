<?php

declare(strict_types=1);

namespace App\Support\Grammar\Concerns;

use App\Support\Syntax\TokenCursor;
use App\Support\Syntax\TreeDraft;

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
