<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Every inbox the person sits at, each with its counts and newest messages.
 */
#[TypeScript]
final class InboxPageData extends Data
{
    /**
     * @param  list<InboxPanelData>  $panels
     */
    public function __construct(
        #[DataCollectionOf(InboxPanelData::class)] public readonly array $panels,
    ) {}
}
