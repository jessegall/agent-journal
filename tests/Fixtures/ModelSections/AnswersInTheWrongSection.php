<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use Illuminate\Database\Eloquent\Model;

/**
 * A model whose Predicates section holds an answer that is no yes or no, and whose Transformers section holds one.
 */
final class AnswersInTheWrongSection extends Model
{
    // ----------[ Predicates ]----------

    public function label(string $prefix): string
    {
        return $prefix;
    }

    // ----------[ Transformers ]----------

    public function isOpen(): bool
    {
        return true;
    }
}
