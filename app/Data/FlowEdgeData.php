<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One edge of a script's flowchart: the port an instruction leaves by and where it leads.
 */
#[TypeScript]
final class FlowEdgeData extends Data
{
    public function __construct(
        public readonly string $from,
        public readonly string $to,
        public readonly string $port,
    ) {}
}
