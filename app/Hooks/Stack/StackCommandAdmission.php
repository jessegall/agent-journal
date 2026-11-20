<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\TargetsAgentStack;
use App\Agents\Support\StackTarget;
use App\Agents\Values\Operation;
use App\Bus\Contracts\CommandAdmission;
use App\Bus\Enums\CommandAdmissionStage;
use App\Bus\Enums\RefusalCode;
use App\Bus\Values\CommandDecision;
use App\Bus\Values\EffectiveCommand;
use App\Hooks\Contracts\StackPermission;
use App\Hooks\Contracts\OperationPolicy;

final readonly class StackCommandAdmission implements CommandAdmission
{
    public function __construct(
        private CurrentActor $actor,
        private CurrentSession $session,
        private StackPermission $stack,
        private OperationPolicy $policy,
    ) {}

    public function assess(EffectiveCommand $command): CommandDecision
    {
        $declaration = $command->operation;

        if ($this->session->hasSession() && $declaration !== null) {
            $operation = Operation::journal($declaration->name, $declaration->area, $declaration->accessTypes);
            $decision = $this->policy->assess($operation);

            if (! $decision->allowed) {
                return CommandDecision::refuse(RefusalCode::Forbidden, $decision->reason);
            }
        }

        if ($command->stage === CommandAdmissionStage::BeforeHandler) {
            return CommandDecision::allow();
        }

        if ($this->session->hasSession()) {
            return $this->assessStack(new StackTarget($this->actor->actor()->id, $this->session->sessionId()), $command);
        }

        if ($command->command instanceof TargetsAgentStack) {
            return $this->assessStack($command->command->target(), $command);
        }

        return CommandDecision::allow();
    }

    private function assessStack(StackTarget $target, EffectiveCommand $command): CommandDecision
    {
        $verdict = $this->stack->allows($target, $command->effect);

        if ($verdict->allowed) {
            return CommandDecision::allow();
        }

        return CommandDecision::refuse(RefusalCode::StateBlocked, $verdict->reason, $verdict->recovery);
    }
}
