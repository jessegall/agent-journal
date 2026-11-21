<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\AgentStackCommand;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Values\StackTarget;
use App\Bus\Contracts\CommandAdmission;
use App\Bus\Enums\CommandAdmissionStage;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Enums\RefusalCode;
use App\Bus\Values\CommandDecision;
use App\Bus\Values\EffectiveCommand;
use App\Hooks\Stack\Contracts\StackPermission;

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
