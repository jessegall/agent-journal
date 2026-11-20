<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\ReadAdmission;
use App\Agents\Enums\AccessRuleType;
use App\Agents\Support\StackTarget;
use App\Agents\Values\AccessDecision;
use App\Agents\Values\ReadRequest;
use App\Bus\Enums\CommandEffectType;
use App\Hooks\Contracts\OperationPolicy;
use App\Hooks\Contracts\StackPermission;

final readonly class PolicyReadAdmission implements ReadAdmission
{
    public function __construct(
        private CurrentActor $actors,
        private CurrentSession $session,
        private OperationPolicy $policy,
        private StackPermission $stack,
    ) {}

    public function assess(ReadRequest $request): AccessDecision
    {
        if (! $this->actors->hasActor()) {
            return AccessDecision::allowed(AccessRuleType::ClassGrant, 'This call has no job profile.');
        }

        $decision = $this->policy->assess($request->operation());

        if ($decision->allowed || ! $this->session->hasSession()) {
            return $decision;
        }

        $target = new StackTarget($this->actors->actor()->id, $this->session->sessionId());
        $recovery = $this->stack->allows($target, CommandEffectType::StateChange)->recovery;

        if ($recovery !== null && $request->matchesRecovery($recovery)) {
            return AccessDecision::allowed(AccessRuleType::OperationGrant, 'The open state asks for this read.');
        }

        return $decision;
    }
}
