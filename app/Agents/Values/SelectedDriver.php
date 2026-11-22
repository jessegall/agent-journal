<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\DriverSourceType;
use App\Agents\Exceptions\DefaultUnavailable;
use App\Agents\Exceptions\DriverConflict;
use App\Agents\Exceptions\DriverRequired;
use App\Agents\Exceptions\DriverUnsupported;
use App\Agents\Exceptions\ModelUnavailable;
use App\Drivers\Contracts\DriverCatalogue;

/**
 * The driver and concrete model a start runs, the model selection it asked for and where the driver came from.
 */
final readonly class SelectedDriver
{
    public function __construct(
        public string $driver,
        public string $model,
        public ModelSelection $requested,
        public SelectionSource $source,
    ) {}

    /**
     * The same selection pinned to a profile, for a start whose selection named none.
     */
    public function pinnedTo(string $profileKey, int $revision): self
    {
        $source = new SelectionSource($this->source->driverSource, $profileKey, $revision);

        return new self($this->driver, $this->model, $this->requested, $source);
    }

    /**
     * Applies D7: a driver the caller names wins unless the profile pins another, then the profile's driver, then
     * the parent session's; the default model comes from the profile, and a named one must be allowed by it.
     *
     * @throws DriverRequired
     * @throws DriverConflict
     * @throws DriverUnsupported
     * @throws DefaultUnavailable
     * @throws ModelUnavailable
     */
    public static function resolve(
        string|null $driverKey,
        ModelSelection $requested,
        ProfileDefaults|null $profile,
        string|null $parentDriver,
        DriverCatalogue $drivers,
    ): self {
        [$driver, $driverSource] = self::driver($driverKey, $profile, $parentDriver, $drivers);
        $source = new SelectionSource($driverSource, $profile?->key, $profile?->revision);

        return new self($driver, self::model($requested, $profile, $driver), $requested, $source);
    }

    /**
     * @return array{0: string, 1: DriverSourceType}
     *
     * @throws DriverRequired
     * @throws DriverConflict
     * @throws DriverUnsupported
     */
    private static function driver(
        string|null $driverKey,
        ProfileDefaults|null $profile,
        string|null $parentDriver,
        DriverCatalogue $drivers,
    ): array {
        if ($driverKey !== null) {
            $driver = self::supported($driverKey, $drivers);

            if ($profile !== null && $profile->driverPinned && $profile->driver !== $driver) {
                throw DriverConflict::for($profile->key, $driver);
            }

            return [$driver, DriverSourceType::Explicit];
        }

        if ($profile?->driver !== null) {
            return [$profile->driver, DriverSourceType::Profile];
        }

        if ($parentDriver !== null) {
            return [self::supported($parentDriver, $drivers), DriverSourceType::ParentSession];
        }

        throw DriverRequired::forStart();
    }

    /**
     * @throws DefaultUnavailable
     * @throws ModelUnavailable
     */
    private static function model(
        ModelSelection $requested,
        ProfileDefaults|null $profile,
        string $driver,
    ): string {
        $model = $requested->model;

        if ($model === null) {
            return $profile->defaultModel ?? throw DefaultUnavailable::forStart();
        }

        if ($profile !== null && ! $profile->allows($model)) {
            throw ModelUnavailable::for($model, $driver);
        }

        return $model;
    }

    /**
     * @throws DriverUnsupported
     */
    private static function supported(string $driverKey, DriverCatalogue $drivers): string
    {
        if (! $drivers->hasFamily($driverKey)) {
            throw DriverUnsupported::for($driverKey);
        }

        return $driverKey;
    }
}
