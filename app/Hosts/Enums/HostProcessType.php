<?php

declare(strict_types=1);

namespace App\Hosts\Enums;

/**
 * How a host holds a process's input and output: behind a terminal or through pipes.
 */
enum HostProcessType: string
{
    case Terminal = 'terminal';
    case Pipe = 'pipe';
}
