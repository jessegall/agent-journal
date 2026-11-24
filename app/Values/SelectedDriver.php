<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\DriverSourceType;
use App\Exceptions\DefaultUnavailable;
use App\Exceptions\DriverRequired;
use App\Exceptions\DriverUnsupported;

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
     * A driver the caller names wins, then the profile's preferred driver, then the parent session's; a model the
     * caller names wins, otherwise the driver family's model at the profile's preferred tier.
     *
     * @throws DriverRequired
     * @throws DriverUnsupported
     * @throws DefaultUnavailable
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

        return new self($driver, self::model($requested, $profile, $drivers->family($driver)), $requested, $source);
    }

    /**
     * @return array{0: string, 1: DriverSourceType}
     *
     * @throws DriverRequired
     * @throws DriverUnsupported
     */
    private static function driver(
        string|null $driverKey,
        ProfileDefaults|null $profile,
        string|null $parentDriver,
        DriverCatalogue $drivers,
    ): array {
        if ($driverKey !== null) {
            return [self::supported($driverKey, $drivers), DriverSourceType::Explicit];
        }

        if ($profile?->preferredDriver !== null) {
            return [$profile->preferredDriver, DriverSourceType::Profile];
        }

        if ($parentDriver !== null) {
            return [self::supported($parentDriver, $drivers), DriverSourceType::ParentSession];
        }

        throw DriverRequired::forStart();
    }

    /**
     * @throws DefaultUnavailable
     */
    private static function model(ModelSelection $requested, ProfileDefaults|null $profile, DriverFamily $family): string
    {
        if ($requested->model !== null) {
            return $requested->model;
        }

        if ($profile === null) {
            throw DefaultUnavailable::forStart();
        }

        return $family->modelAt($profile->preferredTier);
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
