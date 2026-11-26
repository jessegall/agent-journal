<?php

declare(strict_types=1);

namespace App\Support;

use App\Accounts\Enums\AccountModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Exceptions\ImageUnverified;
use App\Hosts\Contracts\DockerImageVerifier;
use App\Hosts\Contracts\HostCapabilities;
use App\Hosts\HostCapabilityQuery;
use App\Hosts\HostCapacityLock;
use App\Models\Sessions\CapacityReservation;
use App\Projects\Enums\HostCapabilityType;
use App\Sessions\Values\ExecutionPolicy;
use App\Sessions\Values\HostCapacity;

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
        CapacityReservation::create($requestId, $execution->budgets, $this->capacity);
    }

    public function assertSupported(string $driver): void
    {
        foreach ([
            HostCapabilityType::AccountTransport,
            HostCapabilityType::ContainerRuntime,
        ] as $capability) {
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
