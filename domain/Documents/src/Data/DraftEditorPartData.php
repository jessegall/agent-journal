<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The editor of the viewer's own draft as a native part of the document's layout: the document and the draft it holds.
 */
#[TypeScript]
final class DraftEditorPartData extends Data
{
    public function __construct(public readonly string $number, public readonly DraftView $draft) {}
}
