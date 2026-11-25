<?php

declare(strict_types=1);

namespace App\Support\Capabilities;

use App\Contracts\Drivers\DriverCapabilities;
use App\Enums\DriverCapability;
use App\Values\BoundTarget;
use App\Values\OperationSupport;
use App\Values\SupportSnapshot;

/**
 * A driver with no terminal, one child or thread per turn: it runs and resumes, but has no screen to watch or type on.
 */
final readonly class HeadlessCapabilities implements DriverCapabilities
{
    public const string NO_TERMINAL = 'A headless driver has no terminal to watch or type into.';

    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        return SupportSnapshot::allowingAllBut(self::unsupportedWithoutTerminal());
    }

    /**
     * What no headless driver can do, for having no terminal.
     *
     * @return list<array{DriverCapability, OperationSupport}>
     */
    public static function unsupportedWithoutTerminal(): array
    {
        $noTerminal = OperationSupport::unsupported(self::NO_TERMINAL);

        return [
            [
                DriverCapability::Watch,
                $noTerminal,
            ],
            [
                DriverCapability::Type,
                $noTerminal,
            ],
            [
                DriverCapability::Paste,
                $noTerminal,
            ],
            [
                DriverCapability::Resize,
                $noTerminal,
            ],
            [
                DriverCapability::PrivateEntry,
                $noTerminal,
            ],
            [
                DriverCapability::KeyScripts,
                $noTerminal,
            ],
        ];
    }
}
