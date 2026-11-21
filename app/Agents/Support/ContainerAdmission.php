<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\DockerImageVerifier;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Agents\Exceptions\ImageUnverified;
use App\Agents\Models\CapacityReservation;
use App\Agents\Values\ExecutionPolicy;
use App\Agents\Values\HostCapacity;
use App\Programs\Enums\HookProgram;

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
     * before it reserves its share of the host; it never falls back to the host.
     *
     * @throws ImageUnverified
     */
    public function admit(string $requestId, HookProgram $program, ExecutionPolicy $execution): void
    {
        $this->assertSupported($program);

        if (! $this->images->isVerified((string) $execution->imageReference)) {
            throw ImageUnverified::because((string) $execution->imageReference);
        }

        $this->capacityLock->holdUntilCommit();
        CapacityReservation::reserve($requestId, $execution->budgets, $this->capacity);
    }

    public function assertSupported(HookProgram $program): void
    {
        foreach ([HostCapabilityType::AccountTransport, HostCapabilityType::ContainerRuntime] as $capability) {
            $query = new HostCapabilityQuery(
                $capability,
                $program,
                AccountModeType::Subscription,
                ExecutionModeType::RequiredContainer,
            );
            $this->capabilities->capability($query)->assertSupported();
        }
    }
}
