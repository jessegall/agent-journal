<?php

declare(strict_types=1);

namespace App\Settings\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One text option of a choice setting, with its label.
 */
#[TypeScript]
final class StringChoiceOptionData extends Data
{
    public function __construct(
        public readonly string $value,
        public readonly string $label,
    ) {}
}
