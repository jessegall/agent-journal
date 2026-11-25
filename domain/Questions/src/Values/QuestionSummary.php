<?php

declare(strict_types=1);

namespace Domain\Questions\Values;

/**
 * A question as another domain shows it: its id, its first line and the inbox it was asked in.
 */
final readonly class QuestionSummary
{
    public function __construct(
        public string $id,
        public string $firstLine,
        public string $inboxId,
    ) {}
}
