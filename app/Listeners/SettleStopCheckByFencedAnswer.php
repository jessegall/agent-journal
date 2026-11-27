<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Hosts\Contracts\HostInstructionAnswerEvent;
use App\Hosts\Protocol\HostInstructionType;
use App\Sessions\Commands\SettleFencedStopCheck\SettleFencedStopCheckCommand;

/**
 * The host's answer to a run_fenced instruction, or its refusal, settles the stop attempt whose conditions it ran.
 */
final readonly class SettleStopCheckByFencedAnswer implements Listener
{
    private const string TRUSTED_ENTRY = 'stop conditions';

    public function __construct(private JournalCommands $commands) {}

    public function handle(HostInstructionAnswerEvent $fact): void
    {
        if ($fact->type !== HostInstructionType::RunFenced) {
            return;
        }

        $command = new SettleFencedStopCheckCommand($fact->instructionId);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $command);
    }
}
