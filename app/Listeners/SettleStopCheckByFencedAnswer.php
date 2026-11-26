<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Hosts\Contracts\HostOrderAnswerEvent;
use App\Hosts\Enums\HostOrderType;
use App\Sessions\Commands\SettleFencedStopCheck\SettleFencedStopCheckCommand;

/**
 * The host's answer to a run_fenced order, or its refusal, settles the stop attempt whose conditions it ran.
 */
final readonly class SettleStopCheckByFencedAnswer implements Listener
{
    private const string TRUSTED_ENTRY = 'stop conditions';

    public function __construct(private JournalCommands $commands) {}

    public function handle(HostOrderAnswerEvent $fact): void
    {
        if ($fact->type !== HostOrderType::RunFenced) {
            return;
        }

        $command = new SettleFencedStopCheckCommand($fact->orderId);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $command);
    }
}
