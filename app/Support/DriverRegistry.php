<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\CommandBus;
use App\Contracts\Driver;
use App\Contracts\DriverCapabilities;
use App\Contracts\DriverCatalogue;
use App\Enums\DriverVariant;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Exceptions\DriverFamilyRegisteredTwice;
use App\Exceptions\DriverFamilyUnknown;
use App\Exceptions\DriverModeAmbiguous;
use App\Exceptions\DriverRegisteredTwice;
use App\Exceptions\DriverUnknown;
use App\Values\BoundTarget;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\PinnedDriver;
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

    /**
     * @var Registry<DriverFamily>
     */
    private readonly Registry $families;

    private int $revision = 0;

    public function __construct(private readonly Container $container)
    {
        $this->registrations = Registry::once(DriverUnknown::for(...), DriverRegisteredTwice::for(...));
        $this->families = Registry::once(DriverFamilyUnknown::for(...), DriverFamilyRegisteredTwice::for(...));
    }

    /**
     * @throws DriverFamilyRegisteredTwice
     */
    public function registerFamily(DriverFamily $family): void
    {
        $this->families->put($family->key, $family);
    }

    /**
     * @throws DriverFamilyUnknown when no family is registered under the registration's family
     * @throws DriverRegisteredTwice
     * @throws DriverModeAmbiguous
     */
    public function register(DriverRegistration $registration): void
    {
        $key = (string) $registration->key;

        if (! $this->families->has($registration->family)) {
            throw DriverFamilyUnknown::for($registration->family);
        }

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
     * @throws DriverUnknown
     * @throws DriverCapabilityUnsupported
     */
    public function pinned(string $family, DriverVariant $mode, array $neededCapabilities = []): PinnedDriver
    {
        $driver = $this->forKey($this->keyFor($family, $mode));
        $registration = $driver->descriptor();
        $support = $driver->capabilities(BoundTarget::beforePlacement());
        $support->assertSupports([...$registration->profileRequirements, ...$neededCapabilities]);

        return new PinnedDriver($registration, $this->revision, $support);
    }

    /**
     * @return list<DriverRegistration>
     */
    public function catalogue(): array
    {
        return array_values($this->registrations->all());
    }

    public function hasFamily(string $key): bool
    {
        return $this->families->has($key);
    }

    public function family(string $key): DriverFamily
    {
        return $this->families->get($key);
    }

    /**
     * @return list<DriverFamily>
     */
    public function families(): array
    {
        return array_values($this->families->all());
    }

    /**
     * @return list<string>
     */
    public function familyKeys(): array
    {
        return array_map(fn (DriverFamily $family) => $family->key, $this->families());
    }

    public function revision(): int
    {
        return $this->revision;
    }
}
