<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

/**
 * A section that targets a slot no installed page offers.
 */
final class UiSlotMissing extends DomainDeclarationError
{
    public static function for(string $section, string $slot): self
    {
        return new self("Section {$section} targets the slot {$slot}, which no installed page offers.");
    }
}
