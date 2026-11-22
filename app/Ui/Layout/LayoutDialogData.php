<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A dialog a layout opens from one of its own parts: its title, the sentence a toast says once the form is accepted,
 * the inverse action that toast offers as Undo, only when the record's domain has one, and the noun whose registered
 * draft producer offers the guided entry, only when there is one.
 */
#[TypeScript]
final class LayoutDialogData extends Data
{
    public function __construct(
        public readonly string $title,
        public readonly string $confirmation,
        public readonly LayoutFormData|Optional $undo = new Optional(),
        public readonly string|Optional $guidedNoun = new Optional(),
    ) {}
}
