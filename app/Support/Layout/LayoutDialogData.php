<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A dialog a layout opens from one of its parts: its title, the toast's sentence once the form is accepted, the Undo
 * action when the domain has one, and the noun whose draft producer offers the guided entry. A dialog opened from a
 * page header names its other ways, shown as a split button.
 */
#[TypeScript]
final class LayoutDialogData extends Data
{
    /** @use Buildable<LayoutDialogDataFields> */
    use Buildable;

    protected const string FIELDS = LayoutDialogDataFields::class;

    public function __construct(
        public readonly string $title,
        public readonly string $confirmation,
        public readonly LayoutFormData|Optional $undo = new Optional(),
        public readonly string|Optional $guidedNoun = new Optional(),
        public readonly LayoutWaysData|Optional $ways = new Optional(),
    ) {}
}
