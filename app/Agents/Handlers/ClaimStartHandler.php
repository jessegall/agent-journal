<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ClaimStart;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\ClaimedStart;
use App\Contracts\CommandHandler;

final readonly class ClaimStartHandler implements CommandHandler
{
    public function handle(ClaimStart $command): ClaimedStart|null
    {
        $start = ProcessStart::claimFor($command->hostId, $command->sessionId);

        if ($start === null) {
            return null;
        }

        return new ClaimedStart($start->start_key, $start->session_id, $start->directory, $start->account_generation);
    }
}
