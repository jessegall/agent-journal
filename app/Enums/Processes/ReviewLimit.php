<?php

declare(strict_types=1);

namespace App\Enums\Processes;

/**
 * The limits on what is sent to an agent for classification: a shape longer than
 * ShapeCharacters is never sent, and each batch holds at most BatchShapes shapes and BatchCharacters characters.
 * ShapeCharacters covers every distilled shape measured in the corpus (the longest is 174 characters) with room for
 * unseen ones, under the user's ceiling of 2,000.
 */
enum ReviewLimit: int
{
    case ShapeCharacters = 1_000;
    case BatchShapes = 20;
    case BatchCharacters = 8_000;

    /**
     * Whether a measured amount goes past the limit.
     */
    public function isPassedBy(int $amount): bool
    {
        return $amount > $this->value;
    }

    /**
     * The limit as a reader names it, such as 1,000 characters.
     */
    public function label(): string
    {
        return match ($this) {
            self::BatchShapes => number_format($this->value).' shapes',
            self::ShapeCharacters, self::BatchCharacters => number_format($this->value).' characters',
        };
    }
}
