<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Sessions\Enums\TransportProfileType;

/**
 * What the host does to run a claimed start on its account, as the driver's adapter checked it for the pinned build:
 * the environment it sets, points at empty folders and removes, the flags, the entries kept in the account's
 * configuration, and the start's private protection settings.
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

    /**
     * The start's variables, each NAME=value: the given ones, then the recipe's own, without any the recipe removes.
     *
     * @param  list<string>  $variables
     * @return list<string>
     */
    public function variablesAfter(array $variables): array
    {
        $all = [
            ...$variables,
            ...array_map(fn (StartSetting $setting) => "{$setting->name}={$setting->settingText}", $this->environment),
        ];

        return array_values(array_filter(
            $all,
            fn (string $entry) => ! in_array(strstr($entry, '=', true), $this->removedVariables, true),
        ));
    }
}
