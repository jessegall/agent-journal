<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * A section that targets a slot no installed page offers.
 */
final class ClientSlotMissing extends ClientDeclarationError
{
    public static function for(string $section, string $slot): self
    {
        return new self("Section {$section} targets the slot {$slot}, which no installed page offers.");
    }
}
