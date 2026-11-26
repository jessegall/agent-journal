<?php

declare(strict_types=1);

namespace App\Values;

use App\Models\Hosts\HostOrder;
use App\Support\Hosts\HostOrderPayload;
use JsonSerializable;

/**
 * One order as the host receives it in a claim: its fields, its payload as the JSON text the signature covers, and
 * the signature.
 */
final readonly class ClaimedHostOrder implements JsonSerializable
{
    private function __construct(
        public string $id,
        public int $sequence,
        public string $type,
        public string $processId,
        public string $payload,
        public string $expiresAt,
        public string $signature,
    ) {}

    public static function of(HostOrder $order, string $signature): self
    {
        return new self(
            $order->id,
            $order->sequence,
            $order->type->value,
            (string) $order->host_process_id,
            HostOrderPayload::encode($order->payload),
            $order->expires_at->utc()->format('Y-m-d\\TH:i:s\\Z'),
            $signature,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'sequence' => $this->sequence,
            'type' => $this->type,
            'process_id' => $this->processId,
            'payload' => $this->payload,
            'expires_at' => $this->expiresAt,
            'signature' => $this->signature,
        ];
    }
}
