<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Programs\Enums\HookProgram;

final readonly class ContainerAdmission
{
    public function __construct(private HostCapabilities $capabilities) {}

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
