<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Models\Hosts\HostOrder;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * An order the journal made for a host or its process: its type, how the host answered it and why it refused.
 */
final readonly class HostOrderFacts implements Facts
{
    public function __construct(private HostOrder $order) {}

    public function facts(): array
    {
        return [
            'type' => $this->order->type,
            'status' => $this->order->status,
            'refusal' => $this->order->refusal,
            'payload' => fn () => json_decode($this->order->payload, true, flags: JSON_THROW_ON_ERROR),
        ];
    }
}
