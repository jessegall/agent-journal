<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Contracts\HostCapabilities;
use App\Enums\CapabilityStatusType;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;

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
