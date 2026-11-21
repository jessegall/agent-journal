<?php

declare(strict_types=1);

namespace App\Docking\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An action the backend offers on a source of one type, such as Add to chat: its label and the source type it acts
 * on. The page names the source's id.
 */
#[TypeScript]
final class SourceActionData extends Data
{
    public function __construct(
        public readonly string $label,
        public readonly string $type,
    ) {}
}
