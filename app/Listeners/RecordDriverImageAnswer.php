<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Events\Connections\HostInstructionAnswered;
use App\Hosts\Commands\RecordDriverImageAnswer\RecordDriverImageAnswerCommand;
use App\Hosts\Protocol\HostInstructionType;

/**
 * A host's answer of a build, an allow set or start checks moves the driver images that waited on it.
 */
final readonly class RecordDriverImageAnswer implements Listener
{
    private const string TRUSTED_ENTRY = 'host driver images';

    private const array IMAGE_INSTRUCTIONS = [
        HostInstructionType::BuildImage,
        HostInstructionType::AllowImages,
        HostInstructionType::RunContainers,
    ];

    public function __construct(private JournalCommands $commands) {}

    public function handle(HostInstructionAnswered $fact): void
    {
        if (! in_array($fact->type, self::IMAGE_INSTRUCTIONS, true)) {
            return;
        }

        $record = new RecordDriverImageAnswerCommand($fact->instructionId);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $record);
    }
}
