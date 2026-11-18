<?php

declare(strict_types=1);

namespace App\Hooks\Inspection;

use App\Hooks\Enums\StackStatus;
use App\Hooks\Models\AgentStackRow;
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
        public readonly int $agentId,
        public readonly int $sessionId,
        public readonly StackStatus $status,
        public readonly int $version,
        #[DataCollectionOf(InspectedFrame::class)]
        public readonly array $frames,
        public readonly InspectedCall|Optional $lastCall = new Optional,
    ) {}

    public static function fromAgentStackRow(AgentStackRow $row, InspectedCall|Optional $lastCall): self
    {
        return new self(
            $row->agent_id,
            $row->session_id,
            $row->status,
            $row->version,
            array_map(InspectedFrame::fromFrameRecord(...), $row->frames->all()),
            $lastCall,
        );
    }
}
