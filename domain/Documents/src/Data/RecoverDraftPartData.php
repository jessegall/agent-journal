<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The form that recovers someone else's held draft, as a native part of the document's layout: the document, who holds
 * the draft and the draft that recovering keeps.
 */
#[TypeScript]
final class RecoverDraftPartData extends Data
{
    public function __construct(
        public readonly string $number,
        public readonly string $holder,
        public readonly DraftView $held,
    ) {}
}
