<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Commands\RefuseProvenStart\RefuseProvenStartCommand;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Bus\Contracts\CommandRefusal;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Events\Sessions\AgentRuntimeStartProven;
use App\Models\Agents\AgentRuntime;

/**
 * A start just proven opens what it runs, its terminal or its first turn, in commands of their own once the proof is
 * committed; an opening the journal refuses refuses the start with its reason, so the start never waits on nothing.
 */
final readonly class OpenWhatAProvenStartRuns implements Listener
{
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(private HeadlessStarts $headless, private JournalCommands $commands) {}

    public function handle(AgentRuntimeStartProven $fact): void
    {
        $runtime = AgentRuntime::query()->whereKey($fact->runtimeId)->sole();

        try {
            $this->headless->openProven($runtime);
        } catch (CommandRefusal $refusal) {
            $refuse = new RefuseProvenStartCommand($runtime->id, $refusal->getMessage());
            $this->commands->runAsJournal(CommandEntry::DriverWorker, self::TRUSTED_ENTRY, $refuse);
        }
    }
}
