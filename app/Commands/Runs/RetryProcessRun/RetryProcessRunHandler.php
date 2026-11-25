<?php

declare(strict_types=1);

namespace App\Commands\Runs\RetryProcessRun;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Admission\ShellAdmission;
use App\Contracts\Bus\CommandHandler;
use App\Enums\Runs\LifecycleState;
use App\Exceptions\RetryRefused;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Support\ProcessAdministration;
use App\Values\AdmissionRefusal;
use App\Values\ExecutionContext;

final readonly class RetryProcessRunHandler implements CommandHandler
{
    public function __construct(
        private ProcessAdministration $administration,
        private ShellAdmission $admissions,
        private AgentTexts $texts,
    ) {}

    /**
     * @throws RetryRefused
     */
    public function handle(RetryProcessRunCommand $command): string
    {
        $lost = ProcessRun::query()->acrossActors()->whereKey($command->runId)->sole();
        $actor = ActorIdentity::of($command->dispatchedBy());

        if (! $this->administration->isGrantedToCaller() && ! $lost->isByActor($actor)) {
            throw RetryRefused::ofAnotherActor($lost->id);
        }

        if ($lost->lifecycle !== LifecycleState::Lost) {
            throw RetryRefused::notLost($lost->id);
        }

        if (! hash_equals($lost->source_digest, hash('sha256', $command->line))) {
            throw RetryRefused::otherLine($lost->id);
        }

        $context = new ExecutionContext($lost->dialect, $lost->working_folder, $lost->working_folder);
        $admission = $this->admissions->admit($command->line, $lost->dialect, $context, $command->requestKey);
        $refusal = $admission->decision;

        if ($refusal instanceof AdmissionRefusal) {
            throw RetryRefused::refused($refusal->code->value, $this->texts->render($refusal->reason));
        }

        return $admission->runId;
    }
}
