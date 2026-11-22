<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The addresses the graph sends a suggestion's three steps to, each given only when a service and the caller's
 * authority for it exist: asking for a suggestion, applying one in a single version-checked change, and undoing it.
 */
#[TypeScript]
final class TaskGraphDestinations extends Data
{
    public function __construct(
        public readonly string|Optional $suggest = new Optional(),
        public readonly string|Optional $apply = new Optional(),
        public readonly string|Optional $undo = new Optional(),
    ) {}
}
