<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\AccountStartSettings;
use App\Support\Compatibility\DriverCompatibility;

/**
 * Fills a driver family's account start settings: where its sign-in lives, the credentials it must not inherit, and
 * the checked flags and settings of its pinned build.
 */
interface AccountSettingsFiller
{
    public function fill(
        AccountStartSettings $settings,
        string $directory,
        string $root,
        DriverCompatibility $compatibility,
    ): void;
}
