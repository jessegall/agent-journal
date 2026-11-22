<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Someone the server lets the viewer send feedback on this document to, in this environment.
 */
#[TypeScript]
final class DocumentRecipientData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
    ) {}
}
