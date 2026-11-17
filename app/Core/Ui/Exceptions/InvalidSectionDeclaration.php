<?php

declare(strict_types=1);

namespace App\Core\Ui\Exceptions;

/**
 * A section that the application refuses to start with.
 */
final class InvalidSectionDeclaration extends UiDeclarationError
{
    public static function readerReturnsNoData(string $section, string $reader): self
    {
        return new self("Section {$section} names the reader {$reader}, whose read method does not declare a concrete Data class as its return type.");
    }

    public static function slotNotFullKey(string $section, string $slot): self
    {
        return new self("Section {$section} targets the slot {$slot}; name a slot by its full key, its domain's name and its own key, such as plans.inspector.");
    }
}
