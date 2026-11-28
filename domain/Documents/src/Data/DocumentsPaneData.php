<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

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
final class DocumentsPaneData extends Data
{
    /** @use \App\Web\Creation\Buildable<DocumentsPaneDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = DocumentsPaneDataFields::class;

    /** @param list<LayoutRowData> $items */
    public function __construct(
        #[DataCollectionOf(LayoutRowData::class), Bounded(5)]
        public readonly array $items,
        public readonly string $fullUrl,
    ) {}
}
