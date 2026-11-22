<?php

declare(strict_types=1);

namespace App\Support\Layout;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A native part a layout mounts by its registered component name, fed by its own typed props, for an interaction a
 * declared part has no contract for yet, such as a comment composer or a draft editor.
 */
#[TypeScript]
final class LayoutNativeData extends Data
{
    /**
     * @param  array<string, mixed>  $props
     */
    private function __construct(
        public readonly string $component,
        public readonly array $props,
    ) {}

    /**
     * The registered component and its props, read from the typed data its reader built.
     */
    public static function of(string $component, Data $props): self
    {
        return new self($component, $props->toArray());
    }
}
