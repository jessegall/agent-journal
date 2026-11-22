<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Whose screen a terminal answer shows: the session and process generation the runtime is registered at, and the host
 * process, stream and privacy revision of the report it came from. A view accepts an answer only for its own identity.
 */
#[TypeScript]
final class TerminalScreenIdentityData extends Data
{
    public function __construct(
        public readonly string $sessionId,
        public readonly int $processGeneration,
        public readonly string $epoch,
        public readonly string|null $stream,
        public readonly int $privacyRevision,
    ) {}
}
