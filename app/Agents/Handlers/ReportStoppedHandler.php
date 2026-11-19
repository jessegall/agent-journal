<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportStopped;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\ProcessStart;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class ReportStoppedHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(ReportStopped $command): void
    {
        $start = ProcessStart::claimedBy($command->hostId, $command->startKey);

        if ($start->stopWithProof()) {
            $this->events->dispatch(new AccountUseChanged($start->accountIdentity()));
        }
    }
}
