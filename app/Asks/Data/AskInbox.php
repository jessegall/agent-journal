<?php

declare(strict_types=1);

namespace App\Asks\Data;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class AskInbox extends Data
{
    /** @use Buildable<AskInboxFields> */
    use Buildable;

    protected const string FIELDS = AskInboxFields::class;

    /**
     * @param  list<AskCard>  $cards
     */
    public function __construct(
        #[DataCollectionOf(AskCard::class)]
        public readonly array $cards,
        public readonly string|null $before,
    ) {}
}
