<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Starts\TransportProfileType;

/**
 * What the host does to run a claimed start on its account, as the driver's adapter checked it for the pinned build:
 * the environment it sets, the variables it points at a new empty folder, the variables it removes so no other
 * credential is used, the flags it passes, the entries it keeps in the account's own configuration, the build and
 * arrangement the recipe holds for, and the private protection settings the host writes for the start alone.
 */
final readonly class AccountStartRecipe
{
    /**
     * @param  list<StartSetting>  $environment
     * @param  list<string>  $emptyFolderVariables
     * @param  list<string>  $removedVariables
     * @param  list<string>  $startFlags
     * @param  list<StartSetting>  $accountSettings
     * @param  list<string>  $readFiles  the files the host opens for the driver, the first on descriptor 3
     */
    public function __construct(
        public array $environment,
        public array $emptyFolderVariables,
        public array $removedVariables,
        public array $startFlags,
        public array $accountSettings,
        public string $driverVersion,
        public string $binaryDigest,
        public string $arrangement,
        public string $protectionSettings,
        public TransportProfileType $transportProfile,
        public array $readFiles,
    ) {}
}
