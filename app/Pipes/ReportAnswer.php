<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Pipe;
use App\Values\CallAnswer;
use App\Values\CommandReport;

/**
 * Reports a call's answer as JSON: pretty by default, on one line when asked.
 */
final readonly class ReportAnswer implements Pipe
{
    public function handle(CallAnswer $answer): CommandReport
    {
        $flags = JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | ($answer->oneLine ? 0 : JSON_PRETTY_PRINT);

        return CommandReport::ending(0)->line((string) json_encode($answer->answer->toArray(), $flags));
    }
}
