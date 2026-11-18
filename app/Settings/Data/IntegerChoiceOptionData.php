<?php

declare(strict_types=1);

namespace App\Settings\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One whole-number option of a choice setting, with its label.
 */
#[TypeScript]
final class IntegerChoiceOptionData extends Data
{
    public function __construct(
        public readonly int $value,
        public readonly string $label,
    ) {}
}
