<?php

declare(strict_types=1);

namespace App\Events\Settings;

/**
 * An owner's settings document was revised.
 */
final readonly class SettingsRevised extends SettingEvent
{
    public function __construct(
        public string $settingsId,
    ) {}
}
