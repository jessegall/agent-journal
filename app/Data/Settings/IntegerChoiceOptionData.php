<?php

declare(strict_types=1);

namespace App\Data\Settings;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One whole-number option of a choice setting, with its label.
 */
#[TypeScript]
final class IntegerChoiceOptionData extends Data
{
    public function __construct(
        #[MapName('value')]
        public readonly int $optionKey,
        public readonly string $label,
    ) {}
}
