<?php

declare(strict_types=1);

namespace App\Drivers\Capabilities;

use App\Drivers\Contracts\DriverCapabilities;
use App\Drivers\Enums\DriverCapability;
use App\Drivers\Values\BoundTarget;
use App\Drivers\Values\OperationSupport;
use App\Drivers\Values\SupportSnapshot;

/**
 * A driver with no terminal, one child or thread per turn: it runs and resumes, but has no screen to watch or type on.
 */
final readonly class HeadlessCapabilities implements DriverCapabilities
{
    public const string NO_TERMINAL = 'A headless driver has no terminal to watch or type into.';

    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        $noTerminal = OperationSupport::unsupported(self::NO_TERMINAL);

        return SupportSnapshot::allowingAllBut([
            [DriverCapability::Watch, $noTerminal],
            [DriverCapability::Type, $noTerminal],
            [DriverCapability::Paste, $noTerminal],
            [DriverCapability::Resize, $noTerminal],
            [DriverCapability::PrivateEntry, $noTerminal],
            [DriverCapability::KeyScripts, $noTerminal],
        ]);
    }
}
