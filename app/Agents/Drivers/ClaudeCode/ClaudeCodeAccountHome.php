<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\AccountEnvironmentPart;
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
     * The PATH of a start from an installation: its Keychain shim, its programs, then the system's.
     */
    public const string INSTALLATION_PATH = '{host:INSTALLATION}/journal/programs/accounts/no-keychain:{host:INSTALLATION}/bin:'
        .'/usr/bin:/bin:/usr/sbin:/sbin';

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

        return $recipe->variablesAfter([
            'HOME={folder:'.self::HOME_FOLDER.'}',
            'PATH='.self::INSTALLATION_PATH,
            ...array_map(
                fn (string $name) => "{$name}={folder:".self::emptyFolderOf($name).'}',
                $recipe->emptyFolderVariables,
            ),
        ]);
    }

    private static function emptyFolderOf(string $variable): string
    {
        return 'empty-'.strtolower($variable);
    }
}
