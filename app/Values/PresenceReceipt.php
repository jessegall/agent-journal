<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What the journal holds of a binding's presence: the binding, the boot generation it holds, the folder's setup
 * generation it acknowledged, the server's time and when the presence expires, in ISO 8601, the binding's authority
 * generation its relay renews runtime leases under, its effective readiness now and its last confirmed contact.
 */
final readonly class PresenceReceipt
{
    public function __construct(
        public string $bindingId,
        public int $generation,
        public int $setupGeneration,
        public string $serverTime,
        public string $expiresAt,
        public int $authorityGeneration,
        public string $readiness,
        public string|null $lastContactAt,
    ) {}

    /**
     * The receipt as the relay reads it.
     *
     * @return array<string, int|string|null>
     */
    public function toArray(): array
    {
        return [
            'bindingId' => $this->bindingId,
            'generation' => $this->generation,
            'setupGeneration' => $this->setupGeneration,
            'serverTime' => $this->serverTime,
            'presenceExpiresAt' => $this->expiresAt,
            'authorityGeneration' => $this->authorityGeneration,
            'readiness' => $this->readiness,
            'lastContactAt' => $this->lastContactAt,
        ];
    }
}
