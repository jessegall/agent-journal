<?php

declare(strict_types=1);

namespace Domain\Chat\Contracts\Docking;

use Domain\Chat\Support\Wire\DestinationEncoder;

/**
 * One field a part carries on the wire besides its type and key: its name, its TypeScript type and how its value is
 * written.
 */
interface PartField
{
    /**
     * The name of the field on the wire.
     */
    public function name(): string;

    /**
     * The TypeScript type of the field, for the generated frontend types.
     */
    public function typeScript(): string;

    /**
     * The field's value on the part, as the frontend receives it.
     */
    public function encode(DockPart $part, DestinationEncoder $destinations): mixed;
}
