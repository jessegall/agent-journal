<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

/**
 * A setting's value as the settings catalogue shows it, in the variant of the setting's type.
 */
interface CatalogueValue
{
    /**
     * The text a settings form edits the value as; none for a value the form does not edit.
     */
    public function formText(): string|null;
}
