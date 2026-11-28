<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Models\Hosts\HostInstruction;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * An instruction the journal made for a host or its process: its type, how the host answered it and why it refused.
 */
final readonly class HostInstructionFacts implements Facts
{
    public function __construct(private HostInstruction $instruction) {}

    public function facts(): array
    {
        return [
            'type' => $this->instruction->type,
            'status' => $this->instruction->status,
            'refusal' => $this->instruction->refusal,
            'request' => $this->instruction->driver_request_id,
            'step' => $this->instruction->step,
            'payload' => fn () => json_decode($this->instruction->payload, true, flags: JSON_THROW_ON_ERROR),
        ];
    }
}
