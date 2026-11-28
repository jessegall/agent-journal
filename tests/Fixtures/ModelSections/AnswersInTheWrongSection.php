<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use Illuminate\Database\Eloquent\Model;

/**
 * A model whose Predicates section holds an answer that is no yes or no, whose Transformers section holds one, and
 * whose Answers section holds an answer that gives an object.
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

    // ----------[ Answers ]----------

    /**
     * @return list<string>
     */
    public function words(string $text): array
    {
        return explode(' ', $text);
    }
}
