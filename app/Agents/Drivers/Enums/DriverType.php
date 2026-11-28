<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

/**
 * How a host runs a driver: headless, one child per turn, or in one persistent terminal.
 */
enum DriverType: string
{
    case Headless = 'headless';
    case Terminal = 'terminal';

    /**
     * The mode every start the journal makes runs in: the terminal driver is for a user running the
     * driver on their own machine, never a start of the journal's.
     */
    public static function ofJournalStart(): self
    {
        return self::Headless;
    }

    /**
     * The mode a headless choice names: headless when asked for, else the terminal.
     */
    public static function ofHeadless(bool $isHeadless): self
    {
        if ($isHeadless) {
            return self::Headless;
        }

        return self::Terminal;
    }
}
