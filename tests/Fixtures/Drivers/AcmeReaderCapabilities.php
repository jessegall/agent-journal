<?php

declare(strict_types=1);

namespace Tests\Fixtures\Drivers;

use App\Contracts\Drivers\DriverCapabilities;
use App\Enums\DriverCapability;
use App\Values\BoundTarget;
use App\Values\OperationSupport;
use App\Values\SupportSnapshot;

/**
 * A third-party test driver that runs but offers no hook methods, so a profile that needs them cannot launch it.
 */
final readonly class AcmeReaderCapabilities implements DriverCapabilities
{
    public const string NO_HOOKS = 'The Acme reader has no hook methods.';

    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        return SupportSnapshot::allowingAllBut([
            [DriverCapability::HookMethods, OperationSupport::unsupported(self::NO_HOOKS)],
        ]);
    }
}
