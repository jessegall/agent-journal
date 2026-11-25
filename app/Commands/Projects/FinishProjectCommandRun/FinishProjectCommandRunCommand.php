<?php

declare(strict_types=1);

namespace App\Commands\Projects\FinishProjectCommandRun;

use App\Attributes\Entry;
use App\Calls\Connections\ProjectCommandFrame;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Records how a connected machine's journal verb ended: its frames and exit code, the result a repeat answers.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class FinishProjectCommandRunCommand extends Command
{
    /**
     * @param  list<ProjectCommandFrame>  $frames
     */
    public function __construct(public string $requestKey, public array $frames, public int $exitCode) {}
}
