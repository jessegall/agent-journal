<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One emoji a message was reacted with: how many reacted with it and whether the viewer is one of them.
 */
#[TypeScript]
final class ReactionData extends Data
{
    public function __construct(
        public readonly string $emoji,
        public readonly int $count,
        public readonly bool $isOwn,
    ) {}
}
