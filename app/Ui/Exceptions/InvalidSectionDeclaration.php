<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

/**
 * A section that the application refuses to start with.
 */
final class InvalidSectionDeclaration extends UiDeclarationError
{
    public static function resolverReturnsNoData(string $section, string $resolver): self
    {
        return new self(
            sprintf(
                'Section %s names the resolver %s, whose read method does not declare a concrete Data class as its return type.',
                $section,
                $resolver,
            ),
        );
    }

    public static function slotNotFullKey(string $section, string $slot): self
    {
        return new self(
            sprintf(
                "Section %s targets the slot %s; name a slot by its full key, its domain's name and its own key, such as plans.inspector.",
                $section,
                $slot,
            ),
        );
    }

    public static function readerReturnsNoLayout(string $section, string $resolver): self
    {
        return new self(
            sprintf(
                'Section %s is declared as a layout, but its resolver %s does not return DeclaredLayoutData from its read method.',
                $section,
                $resolver,
            ),
        );
    }
}
