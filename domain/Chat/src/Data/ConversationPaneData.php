<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Support\Layout\LayoutRowData;
use App\Web\Attributes\Bounded;
use App\Web\Attributes\Live;
use App\Web\Attributes\Optional as OptionalProp;
use App\Web\Attributes\WindowOnly;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[WindowOnly, OptionalProp, Live]
final class ConversationPaneData extends Data
{
    /** @use \App\Web\Creation\Buildable<ConversationPaneDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = ConversationPaneDataFields::class;

    /** @param list<LayoutRowData> $items */
    public function __construct(
        #[DataCollectionOf(LayoutRowData::class), Bounded(5)]
        public readonly array $items,
        public readonly string $fullUrl,
        public readonly string $label,
    ) {}
}
