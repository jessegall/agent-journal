<?php

declare(strict_types=1);

namespace App\Settings\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The whole-number options of a choice setting, in declaration order.
 */
#[TypeScript]
final class IntegerChoiceConstraintsData extends Data
{
    /**
     * @param  list<IntegerChoiceOptionData>  $options
     */
    public function __construct(
        #[DataCollectionOf(IntegerChoiceOptionData::class)]
        public readonly array $options,
        #[LiteralTypeScriptType("'integerChoice'")]
        public readonly string $kind = 'integerChoice',
    ) {}
}
