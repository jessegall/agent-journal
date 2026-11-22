<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One text option of a choice setting, with its label.
 */
#[TypeScript]
final class StringChoiceOptionData extends Data
{
    public function __construct(
        #[MapName('value')]
        public readonly string $optionKey,
        public readonly string $label,
    ) {}
}
