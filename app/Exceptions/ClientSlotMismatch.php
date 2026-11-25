<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * A slot and what is declared against it that do not fit together.
 */
final class ClientSlotMismatch extends ClientDeclarationError
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
            sprintf(
                'Page %s offers the record slot %s on the route parameter %s, which its path does not have.',
                $page,
                $slot,
                $parameter,
            ),
        );
    }
}
