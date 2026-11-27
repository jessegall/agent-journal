<?php

declare(strict_types=1);

namespace App\Sessions\Commands\HoldStopCheck;

use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Hooks\StopCheckHeld;
use App\Models\Sessions\SessionRequest;
use App\Models\Sessions\StopCheck;
use App\Sessions\Contracts\SessionPolicyReader;
use App\Sessions\Enums\StopCheckStatus;

final readonly class HoldStopCheckHandler implements CommandHandler
{
    private const string PREPARATION_HELD_SUBMISSION = 'preparation-held';

    public function __construct(private SessionPolicyReader $policies, private CommandFacts $facts) {}

    public function handle(HoldStopCheckCommand $command): void
    {
        $attempt = StopCheck::createForPolicy($command->stop(), $this->policies->policyFor($command->sessionId));
        $attempt->settle(StopCheckStatus::Failed, self::PREPARATION_HELD_SUBMISSION, $command->heldReason);

        SessionRequest::findOwnerStartOf($attempt->session_id)->forAll(
            fn (SessionRequest $start) => $this->facts->publishAfterCommit(
                new StopCheckHeld($start->owner_work, $attempt->reference),
            ),
        );
    }
}
