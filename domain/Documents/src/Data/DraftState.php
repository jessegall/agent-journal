<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Enums\EditingState;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Whether a document has an open draft: the viewer's own draft with its text, or the label of who holds it, with
 * the held text for a user, who may recover it.
 */
#[TypeScript]
final class DraftState extends Data
{
    public function __construct(
        public readonly EditingState $state,
        public readonly DraftView|Optional $draft = new Optional(),
        public readonly string|Optional $holder = new Optional(),
        public readonly DraftView|Optional $held = new Optional(),
    ) {}
}
