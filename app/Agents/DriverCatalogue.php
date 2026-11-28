<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Drivers\Contracts\Driver as DriverContract;
use App\Agents\Drivers\Contracts\DriverCapabilities;
use App\Agents\Drivers\Contracts\DriverCatalogue as DriverCatalogueContract;
use App\Agents\Drivers\Contracts\RuntimeHandling;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Exceptions\DriverFamilyRegisteredTwice;
use App\Agents\Exceptions\DriverRegisteredTwice;
use App\Agents\Exceptions\DriverTypeAmbiguous;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Exceptions\DriverFamilyUnknown;
use App\Exceptions\DriverUnknown;
use App\Models\Agents\AgentRuntime;
use App\Support\Registry;
use App\Values\BoundTarget;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\PinnedDriver;
use Illuminate\Contracts\Container\Container;
use PhpOption\Option;

/**
 * The drivers this journal can start, each under its opaque key: a lookup by key is the only way a driver is selected.
 * The catalogue's revision rises with every registration, so a choice made against an older catalogue can be told.
 */
final class DriverCatalogue implements DriverCatalogueContract
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
     * @throws DriverTypeAmbiguous
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
                throw DriverTypeAmbiguous::for(
                    $registration->family,
                    $registration->driverType->value,
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
    public function forKey(DriverKey $key): DriverContract
    {
        $registration = $this->registrations->get((string) $key);

        /**
         * @var DriverCapabilities $capabilities
         */
        $capabilities = $this->container->make($registration->capabilities);

        return new Driver(
            $registration,
            $capabilities,
            $this->container->make(CommandBus::class),
            $this->handlingOf($registration),
        );
    }

    /**
     * @throws DriverUnknown
     */
    public function forRuntime(AgentRuntime $runtime): DriverContract
    {
        return $this->forKey(DriverKey::from($runtime->driver_key));
    }

    /**
     * @throws DriverUnknown
     */
    public function keyFor(string $family, DriverType $driverType): DriverKey
    {
        foreach ($this->catalogue() as $registration) {
            if ($registration->family === $family && $registration->driverType === $driverType) {
                return $registration->key;
            }
        }

        throw DriverUnknown::for("{$family} {$driverType->value}");
    }

    /**
     * @throws DriverUnknown
     * @throws DriverCapabilityUnsupported
     */
    public function pinned(string $family, DriverType $driverType, array $neededCapabilities = []): PinnedDriver
    {
        $driver = $this->forKey($this->keyFor($family, $driverType));
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

    public function familyForStart(string $name): DriverFamily
    {
        foreach ($this->families() as $family) {
            if ($family->hostName === $name) {
                return $family;
            }
        }

        return $this->family($name);
    }

    /**
     * @return Option<DriverFamily>
     */
    public function findFamily(string $key): Option
    {
        return $this->families->find($key);
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

    public function drivenKeys(): array
    {
        $driven = array_filter(
            $this->catalogue(),
            fn (DriverRegistration $registration) => $this->handlingOf($registration)->isRunByJournal(),
        );

        return array_values(array_map(fn (DriverRegistration $registration) => $registration->key->key, $driven));
    }

    private function handlingOf(DriverRegistration $registration): RuntimeHandling
    {
        return $this->container->make($registration->handling);
    }

    public function registrationOfFamily(string $family): DriverRegistration
    {
        foreach ($this->catalogue() as $registration) {
            if ($registration->family === $family) {
                return $registration;
            }
        }

        throw DriverFamilyUnknown::for($family);
    }

    public function revision(): int
    {
        return $this->revision;
    }
}
