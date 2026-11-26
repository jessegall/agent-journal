<?php

declare(strict_types=1);

namespace App\Data\Palette;

use App\Search\Values\EmittedHit;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One hit as the palette shows it: its source, title, excerpt and tier, the record, and the page that opens it at
 * the same target the agent's open action names; no page when the record has none.
 */
#[TypeScript]
final class PaletteHitData extends Data
{
    public function __construct(
        public readonly string $sourceKey,
        public readonly string $sourceLabel,
        public readonly string $title,
        public readonly string $snippet,
        public readonly int $score,
        public readonly string $recordType,
        public readonly string $recordId,
        public readonly string|null $locationLabel,
        public readonly string|null $href,
    ) {}

    public static function of(EmittedHit $hit, string|null $href): self
    {
        return new self(
            $hit->sourceKey,
            $hit->sourceLabel,
            $hit->title,
            $hit->snippet,
            $hit->score->value,
            $hit->reference->type,
            $hit->reference->id,
            $hit->location?->label,
            $href,
        );
    }
}
