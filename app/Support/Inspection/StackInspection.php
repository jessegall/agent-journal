<?php

declare(strict_types=1);

namespace App\Support\Inspection;

use App\Enums\Agents\StackStatus;
use App\Models\Agents\AgentStackRow;
use App\Support\Stack\AgentStack;
use App\Support\Stack\Frames\Frame;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * What the inspector shows of one stack: its session, status and version, its frames bottom first, and its last
 * answered call when one is kept. It only reads; nothing here changes a stack.
 */
final class StackInspection extends Data
{
    /**
     * @param  list<InspectedFrame>  $frames
     */
    public function __construct(
        public readonly string $agentId,
        public readonly string $sessionId,
        public readonly StackStatus $status,
        public readonly int $version,
        #[DataCollectionOf(InspectedFrame::class)]
        public readonly array $frames,
        public readonly InspectedCall|Optional $lastCall = new Optional(),
    ) {}

    /**
     * The stored stack as the restored one marks it: each frame's liveness, read in one batched load, and its top.
     */
    public static function of(AgentStackRow $row, AgentStack $stack, InspectedCall|Optional $lastCall): self
    {
        $top = $stack->top();

        return new self(
            $row->agent_id,
            $row->session_id,
            $row->status,
            $row->version,
            array_map(fn (Frame $frame) => InspectedFrame::fromFrame($frame, $top), $stack->frames()),
            $lastCall,
        );
    }
}
