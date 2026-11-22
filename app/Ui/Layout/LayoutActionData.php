<?php

declare(strict_types=1);

namespace App\Ui\Layout;

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
    /**
     * @param  array<string, string>  $query  the keys of its window's query it changes; none for a link to a page
     */
    private function __construct(
        public readonly array $query,
        public readonly string|Optional $href = new Optional(),
        public readonly string|Optional $reason = new Optional(),
        public readonly bool $submits = false,
        public readonly bool $appends = false,
    ) {}

    public static function to(string $href): self
    {
        return new self([], href: $href);
    }

    /**
     * An action that changes only these keys of its window's query, keeping the rest.
     *
     * @param  array<string, string>  $query
     */
    public static function changing(array $query): self
    {
        return new self($query);
    }

    /**
     * An action that changes only these keys of its window's query and adds the rows it reads to the rows shown, such
     * as Show more on a list read by cursor.
     *
     * @param  array<string, string>  $query
     */
    public static function appending(array $query): self
    {
        return new self($query, appends: true);
    }

    /**
     * The action that sends the form it stands in.
     */
    public static function submitting(): self
    {
        return new self([], submits: true);
    }

    public static function unavailable(string $reason): self
    {
        return new self([], reason: $reason);
    }
}
