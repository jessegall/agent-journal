<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Whether the viewer may settle a question: answer or decline it, offered only to its named respondent while it
 * waits; the command checks again on submission.
 */
#[TypeScript]
final class QuestionActionsData extends Data
{
    public function __construct(
        public readonly bool $answer,
        public readonly bool $decline,
    ) {}
}
