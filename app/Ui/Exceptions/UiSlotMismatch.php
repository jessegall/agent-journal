<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

/**
 * A slot and what is declared against it that do not fit together.
 */
final class UiSlotMismatch extends UiDeclarationError
{
    public static function takes(string $section, string $slot, string $slotTakes, string $sectionTakes): self
    {
        return new self(
            "Section {$section} takes {$sectionTakes}, but its slot {$slot} hands its sections {$slotTakes}.",
        );
    }

    public static function parameterMissing(string $page, string $slot, string $parameter): self
    {
        return new self(
            "Page {$page} offers the record slot {$slot} on the route parameter {$parameter}, which its path does "
                .'not have.',
        );
    }
}
