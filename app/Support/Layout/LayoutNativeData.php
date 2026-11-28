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
    /** @use \App\Web\Creation\Buildable<LayoutNativeDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = LayoutNativeDataFields::class;

    /**
     * @param  array<string, mixed>  $props
     */
    public function __construct(
        public readonly string $component,
        public readonly array $props,
    ) {}
}
