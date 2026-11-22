<?php

declare(strict_types=1);

namespace App\Commands\FinishProjectCommandRun;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\CommandFrame;

/**
 * Records how a connected machine's journal verb ended: its frames and exit code, the result a repeat answers.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class FinishProjectCommandRunCommand extends Command
{
    /**
     * @param  list<CommandFrame>  $frames
     */
    public function __construct(public string $requestKey, public array $frames, public int $exitCode) {}
}
