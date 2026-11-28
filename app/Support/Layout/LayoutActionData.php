<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a layout action leads: a page of the journal by its path, or a change to its own window's query, such as the
 * next page of a list; one that appends adds the rows it reads to the rows already shown; an action that cannot run
 * says why instead and leads nowhere.
 */
#[TypeScript]
final class LayoutActionData extends Data
{
    /** @use Buildable<LayoutActionDataFields> */
    use Buildable;

    protected const string FIELDS = LayoutActionDataFields::class;

    /**
     * @param  array<string, string>  $query  the keys of its window's query it changes; none for a link to a page
     */
    public function __construct(
        public readonly array $query,
        public readonly string|Optional $href = new Optional(),
        public readonly string|Optional $reason = new Optional(),
        public readonly bool $submits = false,
        public readonly bool $appends = false,
    ) {}
}
