<?php

declare(strict_types=1);

namespace App\Processes\Stages\Grammar\Concerns;

use App\Processes\Syntax\TokenCursor;
use App\Processes\Syntax\TreeDraft;

/**
 * The cursor and draft of a grammar stage's context, for the stages that carry one.
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
