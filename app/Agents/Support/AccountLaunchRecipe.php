<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * What the host does to run a claimed start on its account, as the program's adapter checked it for the pinned build:
 * the environment it sets, the variables it points at a new empty folder, the variables it removes so no other
 * credential is used, the flags it passes, the entries it keeps in the account's own configuration, the build and
 * arrangement the recipe holds for, and the private protection settings the host writes for the launch alone.
 */
final readonly class AccountLaunchRecipe
{
    /**
     * @param  list<LaunchSetting>  $environment
     * @param  list<string>  $emptyFolderVariables
     * @param  list<string>  $removedVariables
     * @param  list<string>  $launchFlags
     * @param  list<LaunchSetting>  $accountSettings
     */
    public function __construct(
        public array $environment,
        public array $emptyFolderVariables,
        public array $removedVariables,
        public array $launchFlags,
        public array $accountSettings,
        public string $programVersion,
        public string $binaryDigest,
        public string $arrangement,
        public string $protectionSettings,
    ) {}
}
