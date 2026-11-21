<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Connections\Values\CommandFrame;

/**
 * Records how a connected machine's journal verb ended: its frames and exit code, the result a repeat answers.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class FinishProjectCommandRun extends Command
{
    /**
     * @param  list<CommandFrame>  $frames
     */
    public function __construct(public string $requestId, public array $frames, public int $exitCode) {}
}
