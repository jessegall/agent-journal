<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What protocol/host.json says of one order type: whether it is about one process or the host, the process type it
 * needs, the type of its payload (none for an order that carries none), and what it does to its process and after a
 * restart.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HostOrderTraitsData extends Data
{
    public function __construct(
        public readonly string $scope,
        public readonly string $processType,
        public readonly string|null $payload,
        public readonly bool $opens = false,
        public readonly bool $isInput = false,
        public readonly bool $endsProcess = false,
        public readonly bool $isRepeatable = false,
        // Left out, an order is offered again after a restart unless it is an input.
        public readonly bool|null $offeredAgainAfterRestart = null,
    ) {}

    public function isHostWide(): bool
    {
        return $this->scope === 'host';
    }

    public function isOfferedAgainAfterRestart(): bool
    {
        return $this->offeredAgainAfterRestart ?? ! $this->isInput;
    }
}
