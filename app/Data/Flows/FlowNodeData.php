<?php

declare(strict_types=1);

namespace App\Data\Flows;

use App\Enums\FlowNodeType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One node of a script's flowchart, with the source line of an instruction; its rank is its longest path from the
 * trigger and its order its place in that rank.
 */
#[TypeScript]
final class FlowNodeData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $label,
        public readonly FlowNodeType $type,
        public readonly int|null $line,
        public readonly int $rank = 0,
        public readonly int $order = 0,
    ) {}

    public function placedAt(int $rank, int $order): self
    {
        return clone ($this, ['rank' => $rank, 'order' => $order]);
    }
}
