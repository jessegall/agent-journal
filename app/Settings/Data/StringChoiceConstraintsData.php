<?php

declare(strict_types=1);

namespace App\Settings\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The text options of a choice setting, in declaration order.
 */
#[TypeScript]
final class StringChoiceConstraintsData extends Data
{
    /**
     * @param  list<StringChoiceOptionData>  $options
     */
    public function __construct(
        #[DataCollectionOf(StringChoiceOptionData::class)]
        public readonly array $options,
        #[LiteralTypeScriptType("'stringChoice'")]
        public readonly string $kind = 'stringChoice',
    ) {}
}
