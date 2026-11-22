<?php

declare(strict_types=1);

namespace App\Data;

use App\Support\Section;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of a text version's sections in order, and the section number to read on after when there are more.
 */
#[TypeScript]
final class TextSections extends Data
{
    /**
     * @param  list<Section>  $sections
     */
    public function __construct(
        #[MapName('items')]
        #[DataCollectionOf(Section::class)]
        public readonly array $sections,
        public readonly int|null $nextAfterSection,
    ) {}
}
