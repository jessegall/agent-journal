<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Hosts\DockerImageVerifier;
use App\Contracts\Hosts\HostCapabilities;
use App\Enums\AccountModeType;
use App\Enums\ExecutionModeType;
use App\Enums\HostCapabilityType;
use App\Exceptions\ImageUnverified;
use App\Models\CapacityReservation;
use App\Values\ExecutionPolicy;
use App\Values\HostCapacity;

final readonly class ContainerAdmission
{
    public function __construct(
        private HostCapabilities $capabilities,
        private DockerImageVerifier $images,
        private HostCapacity $capacity,
        private HostCapacityLock $capacityLock,
    ) {}

    /**
     * A required container start needs a proven account transport, a proven container runtime and the verified image
     * before it reserves its share of the host; it never falls back to the host. A start resumed under the same request
     * id that already holds its reservation was admitted and is not admitted again.
     *
     * @throws ImageUnverified
     */
    public function admit(string $requestId, string $driver, ExecutionPolicy $execution): void
    {
        if (CapacityReservation::isHeldFor($requestId)) {
            return;
        }

        $this->assertSupported($driver);

        if (! $this->images->isVerified((string) $execution->imageReference)) {
            throw ImageUnverified::because((string) $execution->imageReference);
        }

        $this->capacityLock->holdUntilCommit();
        CapacityReservation::reserve($requestId, $execution->budgets, $this->capacity);
    }

    public function assertSupported(string $driver): void
    {
        foreach ([HostCapabilityType::AccountTransport, HostCapabilityType::ContainerRuntime] as $capability) {
            $query = new HostCapabilityQuery(
                $capability,
                $driver,
                AccountModeType::Subscription,
                ExecutionModeType::RequiredContainer,
            );

            $this->capabilities->capability($query)->assertSupported();
        }
    }
}
