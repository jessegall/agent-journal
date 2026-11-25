<?php

declare(strict_types=1);

namespace App\Enums\Drivers;

/**
 * How a host runs a driver: headless, one child per turn, or in one persistent terminal.
 */
enum DriverType: string
{
    case Headless = 'headless';
    case Terminal = 'terminal';

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
