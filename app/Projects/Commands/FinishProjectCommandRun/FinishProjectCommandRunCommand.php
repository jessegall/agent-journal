<?php

declare(strict_types=1);

namespace App\Projects\Commands\FinishProjectCommandRun;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Connections\Api\ProjectCommandFrame;
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
