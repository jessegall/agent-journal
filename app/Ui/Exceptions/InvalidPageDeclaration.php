<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

/**
 * A page, one of its slots or one of its pane options that the application refuses to start with.
 */
final class InvalidPageDeclaration extends UiDeclarationError
{
    public static function resolverReturnsNoData(string $page, string $resolver): self
    {
        return new self(
            "Page {$page} names the resolver {$resolver}, whose read method does not declare a concrete Data class as its return type.",
        );
    }

    public static function recordSlotWithoutParameter(string $slot): self
    {
        return new self(
            "Slot {$slot} takes a record, so it must name the route parameter of its page that holds the record; declare it with Slot::record.",
        );
    }

    public static function floatSizeNotPositive(int $width, int $height): self
    {
        return new self("A float size of {$width} by {$height} pixels is refused; both must be above zero.");
    }

    public static function optionWithoutChoices(string $option): self
    {
        return new self("The pane option {$option} offers no choices.");
    }

    public static function unknownChoice(string $option, string $choice): self
    {
        return new self("The pane option {$option} starts on {$choice}, which is not one of its choices.");
    }
}
