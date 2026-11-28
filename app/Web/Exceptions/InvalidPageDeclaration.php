<?php

declare(strict_types=1);

namespace App\Web\Exceptions;

use App\Exceptions\ClientDeclarationError;

/**
 * A page, one of its slots or one of its pane options that the application refuses to start with.
 */
final class InvalidPageDeclaration extends ClientDeclarationError
{
    public static function typePresentsNoLayout(string $page, string $type): self
    {
        return new self("Page {$page} uses the declared layout renderer, but {$type} does not present a layout.");
    }

    public static function missingRecordParameter(string $page, string $parameter): self
    {
        return new self("Page {$page} declares record parameter {$parameter} but its route does not contain it.");
    }

    public static function missingWindow(string $page): self
    {
        return new self("Page {$page} has a Home position but does not declare a compact window.");
    }

    public static function recordSlotWithoutParameter(string $slot): self
    {
        return new self(
            sprintf(
                'Slot %s takes a record, so it must name the route parameter of its page that holds the record; declare it with Slot::record.',
                $slot,
            ),
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
