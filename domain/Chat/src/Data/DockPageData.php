<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Docking\Wire\EncodedCard;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Spatie\TypeScriptTransformer\References\CustomReference;

/**
 * One page of a conversation's dock: the cards the viewer may see, in placement order, and the token that asks for
 * more, which reads the same at the end.
 */
#[TypeScript]
final class DockPageData extends Data
{
    /**
     * @param  list<EncodedCard>  $cards
     */
    public function __construct(
        #[LiteralTypeScriptType(
            '%DockCardEnvelope%[]',
            references: ['DockCardEnvelope' => new CustomReference('docking', 'DockCardEnvelope')],
        )]
        public readonly array $cards,
        public readonly string $more,
    ) {}
}
