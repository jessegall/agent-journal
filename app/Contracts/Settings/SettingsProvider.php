<?php

declare(strict_types=1);

namespace App\Contracts\Settings;

/**
 * A domain that declares settings: it returns its own definition object, whose groups hold its declarations.
 */
interface SettingsProvider
{
    /**
     * The settings this provider declares.
     */
    public function settings(): SettingsDefinition;
}
