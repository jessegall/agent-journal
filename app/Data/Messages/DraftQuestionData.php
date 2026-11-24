<?php

declare(strict_types=1);

namespace App\Data\Messages;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One question a draft producer asks, with the answers it suggests as chips.
 */
#[TypeScript]
final class DraftQuestionData extends Data
{
    /**
     * @param  list<string>  $suggestions
     */
    public function __construct(
        public readonly string $prompt,
        public readonly array $suggestions,
    ) {}
}
