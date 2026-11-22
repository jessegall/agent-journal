<?php

declare(strict_types=1);

namespace App\Drivers\Support;

use App\Agents\Enums\DriverVariant;
use App\Bus\Contracts\CommandBus;
use App\Drivers\Contracts\Driver;
use App\Drivers\Contracts\DriverCapabilities;
use App\Drivers\Contracts\DriverCatalogue;
use App\Drivers\Exceptions\DriverModeAmbiguous;
use App\Drivers\Exceptions\DriverRegisteredTwice;
use App\Drivers\Exceptions\DriverUnknown;
use App\Drivers\Values\DriverKey;
use App\Drivers\Values\DriverRegistration;
use App\Registries\Support\Registry;
use Illuminate\Contracts\Container\Container;

/**
 * The drivers this journal can start, each under its opaque key: a lookup by key is the only way a driver is selected.
 * The catalogue's revision rises with every registration, so a choice made against an older catalogue can be told.
 */
final class DriverRegistry implements DriverCatalogue
{
    /**
     * @var Registry<DriverRegistration>
     */
    private readonly Registry $registrations;

    private int $revision = 0;

    public function __construct(private readonly Container $container)
    {
        $this->registrations = Registry::once(DriverUnknown::for(...), DriverRegisteredTwice::for(...));
    }

    /**
     * @throws DriverRegisteredTwice
     * @throws DriverModeAmbiguous
     */
    public function register(DriverRegistration $registration): void
    {
        $key = (string) $registration->key;

        if ($this->registrations->has($key)) {
            throw DriverRegisteredTwice::for($key);
        }

        foreach ($this->catalogue() as $registered) {
            if ($registered->sharesModeWith($registration)) {
                throw DriverModeAmbiguous::for(
                    $registration->family,
                    $registration->mode->value,
                    (string) $registered->key,
                    $key,
                );
            }
        }

        $this->registrations->put($key, $registration);
        $this->revision++;
    }

    /**
     * @throws DriverUnknown
     */
    public function forKey(DriverKey $key): Driver
    {
        $registration = $this->registrations->get((string) $key);

        /** @var DriverCapabilities $capabilities */
        $capabilities = $this->container->make($registration->capabilities);

        return new RegisteredDriver($registration, $capabilities, $this->container->make(CommandBus::class));
    }

    /**
     * @throws DriverUnknown
     */
    public function keyFor(string $family, DriverVariant $mode): DriverKey
    {
        foreach ($this->catalogue() as $registration) {
            if ($registration->family === $family && $registration->mode === $mode) {
                return $registration->key;
            }
        }

        throw DriverUnknown::for("{$family} {$mode->value}");
    }

    /**
     * @return list<DriverRegistration>
     */
    public function catalogue(): array
    {
        return array_values($this->registrations->all());
    }

    public function revision(): int
    {
        return $this->revision;
    }
}
