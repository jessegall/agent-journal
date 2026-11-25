<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Projects\CapabilityStatusType;
use App\Exceptions\AccountContainerUnsupported;
use App\Exceptions\ContainerUnavailable;
use App\Exceptions\HostCapabilityUnsupported;

/**
 * The recorded answer for one combination: its status, the evidence file behind it and the reason it holds.
 */
final readonly class HostCapability
{
    public function __construct(
        public HostCapabilityQuery $query,
        public CapabilityStatusType $status,
        public string $evidence,
        public string $reason,
    ) {}

    public function isSupported(): bool
    {
        return $this->status === CapabilityStatusType::Supported;
    }

    /**
     * Refuses a start that needs this capability unless the evidence proves it; nothing is started or changed.
     *
     * @throws AccountContainerUnsupported
     * @throws ContainerUnavailable
     * @throws HostCapabilityUnsupported
     */
    public function assertSupported(): void
    {
        if (! $this->isSupported()) {
            throw $this->query->capability->refusalFor($this);
        }
    }
}
