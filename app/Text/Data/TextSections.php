<?php

declare(strict_types=1);

namespace App\Text\Data;

use App\Text\Support\Section;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of a text version's sections in order, and the section number to read on after when there are more.
 */
#[TypeScript]
final class TextSections extends Data
{
    /**
     * @param  list<Section>  $items
     */
    public function __construct(
        #[DataCollectionOf(Section::class)]
        public readonly array $items,
        public readonly int|null $nextAfterSection,
    ) {}
}
