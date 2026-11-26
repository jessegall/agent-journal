<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Parts;

use App\Agents\Drivers\Contracts\EnvironmentPart;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * The host's own home and PATH, inherited by a driver that runs as the host's user.
 */
final readonly class HostHomeAndPath implements EnvironmentPart
{
    public const array NAMES = [
        'HOME',
        'PATH',
    ];

    /**
     * The host's HOME and PATH, inherited.
     */
    public function __invoke(DriverStart $start): EnvironmentAddition
    {
        return new EnvironmentAddition(inherited: self::NAMES);
    }
}
