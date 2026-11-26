<?php

declare(strict_types=1);

namespace App\Projects\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One project the owner may choose: its id, its key and the label it is shown by.
 */
#[TypeScript]
final class ProjectData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $key,
        public readonly string $label,
    ) {}
}
