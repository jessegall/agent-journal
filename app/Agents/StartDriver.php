<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Values\ProviderKey;
use App\Text\StableKey;
use App\Values\DriverFamily;
use App\Values\DriverKey;

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

        $provider = $drivers->findFamily($driver)->map(fn (DriverFamily $family) => $family->provider)->getOrElse(null);

        return new self($key, $provider);
    }
}
