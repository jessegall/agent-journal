<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Hosts\HostOrderType;

/**
 * What one order tells a host to do, and the key that makes a repeated step of a driver request no second order.
 */
final readonly class HostOrderBody
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function __construct(
        public HostOrderType $type,
        public array $payload,
        public string $idempotencyKey,
        public string|null $driverRequestId = null,
        public string|null $step = null,
    ) {}

    /**
     * @param  array<string, mixed>  $payload
     */
    public static function from(HostOrderType $type, array $payload, HostOrderSource $source): self
    {
        return new self($type, $payload, $source->idempotencyKey(), $source->driverRequestId, $source->step);
    }

    /**
     * What of the payload is kept once the host answered: none of an input's bytes, an opening without the
     * environment that holds the start's credentials, and every other payload whole.
     *
     * @return array<string, mixed>
     */
    public function keptPayload(): array
    {
        return match (true) {
            $this->type->isInput() => [],
            $this->type->isOpening() => [
                ...$this->payload,
                'environment' => [],
            ],
            default => $this->payload,
        };
    }
}
