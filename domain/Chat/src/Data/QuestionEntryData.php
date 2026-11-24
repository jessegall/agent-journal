<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A question as its chat card shows it, with the answer once there is one; only its target may answer it.
 */
#[TypeScript]
final class QuestionEntryData extends Data
{
    /**
     * @param  list<string>  $options
     */
    public function __construct(
        public readonly string $id,
        public readonly string $text,
        public readonly string $type,
        public readonly array $options,
        public readonly string $target,
        public readonly string|null $answer,
        public readonly bool $canAnswer,
    ) {}
}
