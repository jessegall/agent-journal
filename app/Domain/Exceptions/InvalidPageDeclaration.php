<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

/**
 * A page, one of its slots or one of its pane options that the application refuses to start with.
 */
final class InvalidPageDeclaration extends DomainDeclarationError
{
    public static function readerReturnsNoData(string $page, string $reader): self
    {
        return new self("Page {$page} names the reader {$reader}, whose read method does not declare a concrete Data class as its return type.");
    }

    public static function recordSlotWithoutParameter(string $slot): self
    {
        return new self("Slot {$slot} takes a record, so it must name the route parameter of its page that holds the record; declare it with Slot::record.");
    }

    public static function floatSizeNotPositive(int $width, int $height): self
    {
        return new self("A float size of {$width} by {$height} pixels is refused; both must be above zero.");
    }

    public static function optionWithoutChoices(string $option): self
    {
        return new self("The pane option {$option} offers no choices.");
    }

    public static function choicesNotNamed(string $option): self
    {
        return new self("The pane option {$option} must map each choice's value to its label, both as strings.");
    }

    public static function unknownChoice(string $option, string $choice): self
    {
        return new self("The pane option {$option} starts on {$choice}, which is not one of its choices.");
    }
}
