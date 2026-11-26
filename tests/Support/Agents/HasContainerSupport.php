<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Hosts\Contracts\HostCapabilities;
use App\Hosts\HostCapability;
use App\Hosts\HostCapabilityQuery;
use App\Projects\Enums\CapabilityStatusType;

trait HasContainerSupport
{
    protected function setUpHasContainerSupport(): void
    {
        $this->mock(HostCapabilities::class)->shouldReceive('capability')->andReturnUsing(
            fn (HostCapabilityQuery $query) => new HostCapability(
                $query,
                CapabilityStatusType::Supported,
                'Test evidence',
                'Recorded for the test.',
            ),
        );
    }
}
