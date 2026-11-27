<?php

declare(strict_types=1);

namespace App\Recordings\Enums;

/**
 * How a recorded exchange ran, as the mocks replay it (programs/agent/recording/fixture.go Mode): over pipes, line
 * for line, or in a terminal by what is typed.
 */
enum RecordingMode: string
{
    case Process = 'process';
    case Terminal = 'terminal';
}
