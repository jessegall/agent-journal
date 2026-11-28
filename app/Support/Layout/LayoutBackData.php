<?php

declare(strict_types=1);

namespace App\Support\Layout;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The way back from a reader to the list that owns it: its label and the list's address with the environment, tab,
 * filter, search and page it had, so going back finds the same rows.
 */
#[TypeScript]
final class LayoutBackData extends Data
{
    /** @use \App\Web\Creation\Buildable<LayoutBackDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = LayoutBackDataFields::class;

    public function __construct(
        public readonly string $href,
        public readonly string $label,
    ) {}
}
