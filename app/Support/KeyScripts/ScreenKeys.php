<?php

declare(strict_types=1);

namespace App\Support\KeyScripts;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Models\Hosts\HostProcess;
use App\Terminals\Screens\RowRange;
use App\Values\HostInstructionSource;

/**
 * Sends keys guarded by the observed screen and input generation.
 */
final readonly class ScreenKeys
{
    public function __construct(private JournalCommands $journal) {}

    public function send(HostProcess $process, HostFramePayload $frame, string $bytes, string $trustedEntry): string
    {
        $rows = new RowRange(0, count($frame->rows));
        $instruction = new SendHostKeysCommand(
            $process->id,
            $bytes,
            $rows->guardOn($frame),
            $process->input_generation,
            HostInstructionSource::fromJournal(),
        );

        return $this->journal->runAsJournal(CommandEntry::DriverWorker, $trustedEntry, $instruction);
    }
}
