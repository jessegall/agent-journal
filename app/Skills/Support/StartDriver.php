<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Drivers\Contracts\DriverCatalogue;
use App\Drivers\Values\DriverKey;
use App\Drivers\Values\ProviderKey;
use App\Text\Support\StableKey;

/**
 * The driver a session was started with, as its driver and provider keys: a registered driver gives both, a
 * driver without a registration gives no provider, and a session with no driver gives neither.
 */
final readonly class StartDriver
{
    private function __construct(
        public DriverKey|null $driver,
        public ProviderKey|null $provider,
    ) {}

    /**
     * @param  string|null  $driver  the driver the session recorded at start
     */
    public static function of(string|null $driver, DriverCatalogue $drivers): self
    {
        if ($driver === null || ! StableKey::isValid($driver)) {
            return new self(null, null);
        }

        $key = DriverKey::from($driver);

        return new self($key, $drivers->hasFamily($driver) ? $drivers->family($driver)->provider : null);
    }
}
