<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * The part of the host's capacity a start did not fit in.
 */
enum CapacityResource: string
{
    case Cpu = 'cpu';
    case Memory = 'memory';
    case Disk = 'disk';

    /**
     * The public explanation of a capacity refusal that names this resource.
     */
    public function explanation(): string
    {
        return match ($this) {
            self::Cpu => 'The host lacks the required CPU.',
            self::Memory => 'The host lacks the required memory.',
            self::Disk => 'The host lacks the required disk.',
        };
    }
}
