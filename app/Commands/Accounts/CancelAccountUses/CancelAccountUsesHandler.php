<?php

declare(strict_types=1);

namespace App\Commands\Accounts\CancelAccountUses;

use App\Commands\Hosts\StopHostProcess\StopHostProcessCommand;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\SessionProcessStatus;
use App\Events\Sessions\AccountUseChanged;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Support\RecordIdentity;
use App\Values\HostOrderSource;
use Carbon\CarbonImmutable;

final readonly class CancelAccountUsesHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'account drains';

    /**
     * How long a stopped process of the account may take to end on its own, and then to be killed.
     */
    private const int STOP_GRACE_MS = 5000;

    private const int STOP_FORCE_MS = 5000;

    public function __construct(private CommandFacts $facts, private JournalCommands $commands) {}

    public function handle(CancelAccountUsesCommand $command): int
    {
        $cancelled = $this->cancelPendingOf($command->account);
        $this->stopProcessesOf($command->account);

        if ($cancelled > 0) {
            $this->facts->publishAfterCommit(new AccountUseChanged($command->account));
        }

        return $cancelled;
    }

    /**
     * Stops every live process of the account's starts, so each start ends with its process and the account's uses
     * run out; the account's sign-in waits for that.
     */
    private function stopProcessesOf(RecordIdentity $account): void
    {
        $processes = HostProcess::query()->live()
            ->whereIn('session_process_id', SessionProcess::query()->supervised()->onAccount($account)->select('id'))
            ->get();

        foreach ($processes as $process) {
            $stop = new StopHostProcessCommand(
                $process->id,
                self::STOP_GRACE_MS,
                self::STOP_FORCE_MS,
                HostOrderSource::fromJournal(),
            );

            $this->commands->runAsJournal(CommandEntry::DriverWorker, self::TRUSTED_ENTRY, $stop);
        }
    }

    /**
     * Cancels the account's starts that no host has claimed yet, so they never make a process, and answers how many.
     */
    private function cancelPendingOf(RecordIdentity $account): int
    {
        return SessionProcess::query()->supervised()
            ->onAccount($account)
            ->pending()
            ->update(['status' => SessionProcessStatus::Cancelled->value, 'ended_at' => CarbonImmutable::now()]);
    }
}
