<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

/**
 * A composer.lock or package-lock.json, the packages it pins: composer lists them under packages and packages-dev,
 * npm keys them by their node_modules path under packages.
 */
final class LockFileData extends Data
{
    /**
     * @param  array<array-key, LockedPackageData>  $packages
     * @param  list<LockedPackageData>  $developmentPackages
     */
    public function __construct(
        #[DataCollectionOf(LockedPackageData::class)]
        public readonly array $packages = [],
        #[DataCollectionOf(LockedPackageData::class), MapInputName('packages-dev')]
        public readonly array $developmentPackages = [],
    ) {}
}
