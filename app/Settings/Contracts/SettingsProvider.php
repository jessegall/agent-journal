<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

/**
 * A domain that declares settings: it returns its own definition object, whose groups hold its declarations.
 */
interface SettingsProvider
{
    public function settings(): SettingsDefinition;
}
