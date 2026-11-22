<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Who first read a message and when.
 */
#[TypeScript]
final class MessageReader extends Data
{
    public function __construct(
        public readonly string $actorType,
        public readonly string $actorId,
        public readonly string $readAt,
    ) {}
}
