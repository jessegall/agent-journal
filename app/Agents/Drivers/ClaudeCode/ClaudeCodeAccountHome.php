<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Contracts\Drivers\AccountEnvironmentPart;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * An account start's own home: a home folder, a PATH of the protected installation, an empty folder for each variable
 * its recipe names and its recipe's settings, never a variable the recipe removes, and the files it may read.
 */
final readonly class ClaudeCodeAccountHome implements AccountEnvironmentPart
{
    public const string HOME_FOLDER = 'home';

    /**
     * The part of an account start's PATH outside the protected installation.
     */
    private const string SYSTEM_PATH = '/usr/bin:/bin:/usr/sbin:/sbin';

    /**
     * The account's variables, its home and empty folders, and its read files.
     */
    public function __invoke(DriverStart $start, DriverAccount $account): EnvironmentAddition
    {
        return new EnvironmentAddition(
            $this->variablesOf($account),
            [],
            [self::HOME_FOLDER, ...array_map(self::emptyFolderOf(...), $account->recipe->emptyFolderVariables)],
            $account->recipe->readFiles,
        );
    }

    /**
     * @return list<string>
     */
    private function variablesOf(DriverAccount $account): array
    {
        $recipe = $account->recipe;

        $environment = [
            'HOME={folder:'.self::HOME_FOLDER.'}',
            'PATH={host:INSTALLATION}/journal/tools/accounts/no-keychain:{host:INSTALLATION}/bin:'.self::SYSTEM_PATH,
            ...array_map(
                fn (string $name) => "{$name}={folder:".self::emptyFolderOf($name).'}',
                $recipe->emptyFolderVariables,
            ),
            ...array_map(fn ($setting) => "{$setting->name}={$setting->settingText}", $recipe->environment),
        ];

        return array_values(array_filter(
            $environment,
            fn (string $entry) => ! in_array(strstr($entry, '=', true), $recipe->removedVariables, true),
        ));
    }

    private static function emptyFolderOf(string $variable): string
    {
        return 'empty-'.strtolower($variable);
    }
}
