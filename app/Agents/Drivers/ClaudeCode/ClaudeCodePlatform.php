<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\EnvironmentPart;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * The host's own variables Claude Code needs to run, draw and read text, and the normal buffer every recording of the
 * build was made on; no other host variable reaches it.
 */
final readonly class ClaudeCodePlatform implements EnvironmentPart
{
    public const array NAMES = [
        'LANG',
        'LC_ALL',
        'LC_CTYPE',
        'LC_MESSAGES',
        'TERM',
        'COLORTERM',
        'TZ',
        'USER',
        'LOGNAME',
        'SHELL',
    ];

    private const string NORMAL_BUFFER = 'CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1';

    /**
     * The normal buffer, and the platform names inherited.
     */
    public function __invoke(DriverStart $start): EnvironmentAddition
    {
        return new EnvironmentAddition([self::NORMAL_BUFFER], self::NAMES);
    }
}
