<?php

declare(strict_types=1);

namespace App\Sessions\Commands\OpenStopCheck;

use App\Bus\Contracts\CommandHandler;
use App\Models\Sessions\StopCheck;
use App\Sessions\Contracts\SessionPolicyReader;
use App\Sessions\Enums\StopCheckStatus;

final readonly class OpenStopCheckHandler implements CommandHandler
{
    private const string NO_CONDITIONS_SUBMISSION = 'no-conditions';

    public function __construct(private SessionPolicyReader $policies) {}

    public function handle(OpenStopCheckCommand $command): void
    {
        $policy = $this->policies->policyFor($command->sessionId);
        $attempt = StopCheck::open($command->stop(), $policy);

        // A stop with no conditions has nothing to wait on: it passes as it opens.
        if ($policy->stopConditions->isEmpty() && ! $attempt->isSettled()) {
            $attempt->settle(StopCheckStatus::Passed, self::NO_CONDITIONS_SUBMISSION, '');
            $attempt->certify();
        }
    }
}
