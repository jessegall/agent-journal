<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Parts;

use App\Agents\Drivers\Contracts\AccountEnvironmentPart;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * The environment of an account start in its container: the image user's home and the account's own variables, its
 * empty folders under /tmp. The image's PATH stays, and nothing names a folder of the host.
 */
final readonly class ContainerAccountHome implements AccountEnvironmentPart
{
    private const string HOME = '/home/journal';

    private const string EMPTY_FOLDERS = '/tmp/journal-empty';

    public function __invoke(DriverStart $start, DriverAccount $account): EnvironmentAddition
    {
        $recipe = $account->recipe;

        $variables = $recipe->variablesAfter([
            'HOME='.self::HOME,
            ...array_map(
                fn (string $name) => "{$name}=".self::EMPTY_FOLDERS.'/'.strtolower($name),
                $recipe->emptyFolderVariables,
            ),
        ]);

        return new EnvironmentAddition($variables, [], [], []);
    }
}
