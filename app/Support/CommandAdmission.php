<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Bus\CommandAdmission as CommandAdmissionContract;
use App\Contracts\Sessions\CurrentSession;
use App\Enums\Engine\RefusalCode;
use App\Values\CommandDecision;
use App\Values\EffectiveCommand;

final readonly class CommandAdmission implements CommandAdmissionContract
{
    public function __construct(
        private CurrentSession $session,
        private CommandAdmissions $admissions,
        private AgentTexts $texts,
    ) {}

    public function assess(EffectiveCommand $command): CommandDecision
    {
        $authorize = $command->authorize;

        if ($this->session->hasSession() && $authorize !== null) {
            $decision = $this->admissions->admitsDeclared($command->command::class, $authorize);

            if (! $decision->isAllowed) {
                return CommandDecision::refuse(RefusalCode::Forbidden, $this->texts->render($decision->reason));
            }
        }

        return CommandDecision::allow();
    }
}
