<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\AgentStackCommand;
use App\Contracts\Bus\CommandAdmission;
use App\Contracts\Sessions\CurrentSession;
use App\Enums\CommandAdmissionStage;
use App\Enums\CommandEffectType;
use App\Enums\RefusalCode;
use App\Support\Stack\Contracts\StackPermission;
use App\Values\CommandDecision;
use App\Values\EffectiveCommand;
use App\Values\StackTarget;

final readonly class StackCommandAdmission implements CommandAdmission
{
    public function __construct(
        private CurrentActor $actor,
        private CurrentSession $session,
        private StackPermission $stack,
        private CommandAdmissions $admissions,
    ) {}

    public function assess(EffectiveCommand $command): CommandDecision
    {
        $authorize = $command->authorize;

        if ($this->session->hasSession() && $authorize !== null) {
            $decision = $this->admissions->admitsDeclared($command->command::class, $authorize);

            if (! $decision->allowed) {
                return CommandDecision::refuse(RefusalCode::Forbidden, $decision->reason);
            }
        }

        if ($command->stage === CommandAdmissionStage::BeforeHandler
            || $command->effect === CommandEffectType::Recovery) {
            return CommandDecision::allow();
        }

        if ($this->session->hasSession()) {
            return $this->assessStack(
                new StackTarget($this->actor->actor()->id, $this->session->sessionId()),
                $command,
            );
        }

        if ($command->command instanceof AgentStackCommand) {
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
