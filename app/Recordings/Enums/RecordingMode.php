<?php

declare(strict_types=1);

namespace App\Recordings\Enums;

/**
 * How a recorded exchange ran, as the mocks replay it (programs/runner/recording/fixture.go Mode): over pipes, line
 * for line, in a terminal by what is typed, or as calls asked and answered on a wire.
 */
enum RecordingMode: string
{
    case Process = 'process';
    case Terminal = 'terminal';
    case Calls = 'calls';
}
