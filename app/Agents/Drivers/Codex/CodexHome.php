<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Contracts\EnvironmentPart;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * Codex's home: the account's folder, or the start's own files folder for a start with no account.
 */
final readonly class CodexHome implements EnvironmentPart
{
    public const string FILES_FOLDER = '{folder:files}';

    /**
     * CODEX_HOME for the start.
     */
    public function __invoke(DriverStart $start): EnvironmentAddition
    {
        return new EnvironmentAddition(['CODEX_HOME='.($start->account->folder ?? self::FILES_FOLDER)]);
    }
}
