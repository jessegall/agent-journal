<?php

declare(strict_types=1);

namespace App\Support;

use App\Accounts\Enums\AccountModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Exceptions\ImageUnverified;
use App\Hosts\Contracts\DockerImageVerifier;
use App\Hosts\Contracts\HostCapabilities;
use App\Hosts\HostCapabilityQuery;
use App\Projects\Enums\HostCapabilityType;
use App\Sessions\Values\ExecutionPolicy;

final readonly class ContainerAdmission
{
    public function __construct(
        private HostCapabilities $capabilities,
        private DockerImageVerifier $images,
    ) {}

    /**
     * A required container start needs a proven account transport, a proven container runtime and the verified image;
     * it never falls back to the host.
     *
     * @throws ImageUnverified
     */
    public function admit(string $driver, ExecutionPolicy $execution): void
    {
        $this->assertSupported($driver);

        if (! $this->images->isVerified((string) $execution->imageReference)) {
            throw ImageUnverified::because((string) $execution->imageReference);
        }
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
