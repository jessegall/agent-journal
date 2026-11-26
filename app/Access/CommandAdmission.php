<?php

declare(strict_types=1);

namespace App\Access;

use App\Actors\Contracts\AgentTexts;
use App\Bus\Contracts\CommandAdmission as CommandAdmissionContract;
use App\Bus\Values\CommandDecision;
use App\Bus\Values\EffectiveCommand;
use App\Engine\Enums\RefusalCode;
use App\Sessions\Contracts\CurrentSession;

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
