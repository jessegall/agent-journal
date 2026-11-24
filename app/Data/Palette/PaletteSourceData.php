<?php

declare(strict_types=1);

namespace App\Data\Palette;

use App\Values\DeclaredSearchable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One source the palette may search, as its scope picker shows it: the key, the label and both together.
 */
#[TypeScript]
final class PaletteSourceData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly string $display,
    ) {}

    public static function fromDeclared(DeclaredSearchable $source): self
    {
        return new self($source->qualifiedKey, $source->label(), $source->display());
    }
}
