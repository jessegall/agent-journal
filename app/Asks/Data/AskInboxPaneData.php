<?php

declare(strict_types=1);

namespace App\Asks\Data;

use App\Web\Attributes\Bounded;
use App\Web\Attributes\Live;
use App\Web\Attributes\Optional as OptionalProp;
use App\Web\Attributes\WindowOnly;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[WindowOnly, OptionalProp, Live]
final class AskInboxPaneData extends Data
{
    /** @use \App\Web\Creation\Buildable<AskInboxPaneDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = AskInboxPaneDataFields::class;

    /** @param list<AskPreviewData> $items */
    public function __construct(
        #[DataCollectionOf(AskPreviewData::class), Bounded(5)]
        public readonly array $items,
        public readonly string $inboxUrl,
    ) {}
}
