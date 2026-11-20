<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;

trait HasContainerSupport
{
    protected function setUpHasContainerSupport(): void
    {
        $this->mock(HostCapabilities::class)->shouldReceive('capability')->andReturnUsing(
            fn (HostCapabilityQuery $query): HostCapability => new HostCapability(
                $query,
                CapabilityStatusType::Supported,
                'Test evidence',
                'Recorded for the test.',
            ),
        );
    }
}
