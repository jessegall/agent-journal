<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Data\Messages\MessageView;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The one question a notification opened, read passively: the question as the reader may see it now and its answer
 * once it has one. Opening it reads nothing, takes nothing up and answers nothing.
 */
#[TypeScript]
final class FocusedQuestionData extends Data
{
    public function __construct(
        public readonly MessageView $question,
        public readonly MessageView|Optional $answer = new Optional(),
    ) {}
}
