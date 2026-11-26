<?php

declare(strict_types=1);

namespace App\Accounts\Contracts;

use App\Accounts\AccountStartSettings;
use App\Support\Compatibility\DriverCompatibility;

/**
 * Fills a driver family's account start settings: where its sign-in lives, the credentials it must not inherit, and
 * the checked flags and settings of its pinned build.
 */
interface AccountSettingsFiller
{
    /**
     * Writes the driver's settings for an account start into its directory under the root, as the driver's version
     * expects them.
     */
    public function fill(
        AccountStartSettings $settings,
        string $directory,
        string $root,
        DriverCompatibility $compatibility,
    ): void;
}
