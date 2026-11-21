<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Why a proposed driver, variant and placement cannot start, in the words Home and the CLI both show.
 */
enum StartPreflightRefusal: string
{
    case DriverPinned = 'driver-pinned';
    case ModelNotAllowed = 'model-not-allowed';
    case DriverNotContainable = 'driver-not-containable';
    case NoHost = 'no-host';
    case HostProtocolOutdated = 'host-protocol-outdated';
    case CombinationNotDeclared = 'combination-not-declared';

    public function label(): string
    {
        return match ($this) {
            self::DriverPinned => 'This profile runs only its own driver.',
            self::ModelNotAllowed => 'This profile does not allow that model.',
            self::DriverNotContainable => 'Codex cannot run in a container yet: its sandbox does not keep its tools '
                .'from its sign-in.',
            self::NoHost => 'No connected host runs agents in this place.',
            self::HostProtocolOutdated => 'The host speaks another protocol version; upgrade journal-agent.',
            self::CombinationNotDeclared => 'The host has not said it can run this driver this way.',
        };
    }
}
