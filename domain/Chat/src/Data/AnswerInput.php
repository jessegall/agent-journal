<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;

/**
 * An answer to a question card: the question's id and the answer, an option of a choice or any text.
 */
final class AnswerInput extends Data
{
    public function __construct(
        #[Size(26)]
        public readonly string $questionId,
        #[Max(10000)]
        public readonly string $answer,
    ) {}
}
