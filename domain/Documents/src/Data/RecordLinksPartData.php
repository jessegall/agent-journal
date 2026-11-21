<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use App\Records\Data\RecordCard;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of a record's links part: the record they leave from and the linked records the user may see.
 */
#[TypeScript]
final class RecordLinksPartData extends Data
{
    /**
     * @param  list<RecordCard>  $links
     */
    public function __construct(
        public readonly string $source,
        #[DataCollectionOf(RecordCard::class)]
        public readonly array $links,
    ) {}
}
