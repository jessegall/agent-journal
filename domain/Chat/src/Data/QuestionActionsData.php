<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the viewer may do with a row: answer or decline a question, offered only to its named respondent while it
 * waits, and retry a given-up delivery, offered only to an operator; each command checks again on submission.
 */
#[TypeScript]
final class QuestionActionsData extends Data
{
    public function __construct(
        public readonly bool $canAnswer,
        public readonly bool $canDecline,
        public readonly bool $canRetryDelivery = false,
    ) {}
}
