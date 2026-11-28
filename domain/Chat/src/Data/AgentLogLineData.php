<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Domain\Chat\Enums\AgentLogLineType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One line of an agent's technical log: when, what happened, quiet detail, and for a failure its reason in plain
 * words and the evidence behind it, with secrets masked.
 */
#[TypeScript]
final class AgentLogLineData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $at,
        public readonly AgentLogLineType $type,
        public readonly string $title,
        public readonly string $detail,
        public readonly bool $isFailure,
        public readonly string|null $reason,
        public readonly string|null $evidence,
    ) {}
}
