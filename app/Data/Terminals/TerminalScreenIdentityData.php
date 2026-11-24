<?php

declare(strict_types=1);

namespace App\Data\Terminals;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Whose screen a terminal answer shows: the session and process generation the runtime is registered at, and the host
 * process, stream, privacy revision, attachment and container instance of the report it came from. A view accepts
 * an answer only for its own identity.
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
        public readonly string|null $attachment = null,
        public readonly string|null $containerInstance = null,
    ) {}
}
