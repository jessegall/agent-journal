<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Contracts\SessionPolicyReader;
use App\Hooks\Contracts\StopConditionGate;
use App\Hooks\Contracts\StopEvidence;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\StopAttemptState;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\StopAttempt;
use App\Hooks\Values\StopAttemptReference;

/**
 * Opens the stop attempt of a session with stop conditions, once per stop callback, and answers by the host's
 * results: still running ends the turn with the job left open, passed allows the stop, and failed or unresolved
 * refuses it with what the conditions said. A session without conditions stops at once.
 */
final readonly class StopAttemptGate implements StopConditionGate
{
    public const string CHECKS_RUNNING = 'Final checks are running: the job stays open until the host reports them.';

    public const string CHECKS_UNRESOLVED = 'The final checks proved neither a pass nor a failure; request the stop again.';

    public function __construct(
        private SessionPolicyReader $policies,
        private StopEvidence $evidence,
    ) {}

    public function answer(HookIdentity $stop): Decision
    {
        if (! $this->policies->isFrozenFor($stop->sessionId)) {
            return Decision::allow();
        }

        $policy = $this->policies->policyFor($stop->sessionId);

        if ($policy->stopConditions->isEmpty()) {
            return Decision::allow();
        }

        $attempt = StopAttempt::openFor(
            $stop,
            $policy->digest(),
            StopAttempt::FIRST_GENERATION,
            $policy->stopConditions->definitionHashes(),
        );
        $result = $this->evidence->result(new StopAttemptReference($attempt->id));

        return match ($result->state) {
            StopAttemptState::Pending => Decision::allow()->withMessage(self::CHECKS_RUNNING),
            StopAttemptState::Passed => Decision::allow(),
            StopAttemptState::Failed => Decision::deny($result->failureSummary()),
            StopAttemptState::Unresolved => Decision::deny(self::CHECKS_UNRESOLVED),
        };
    }
}
