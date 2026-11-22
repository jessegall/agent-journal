<?php

declare(strict_types=1);

namespace App\Processes\Commands\RetryProcessRun;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Contracts\ShellAdmission;
use App\Processes\Enums\LifecycleState;
use App\Processes\Exceptions\RetryRefused;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\ProcessAdministration;
use App\Processes\Values\AdmissionRefusal;
use App\Processes\Values\ExecutionContext;

final readonly class RetryProcessRunHandler implements CommandHandler
{
    public function __construct(private ProcessAdministration $administration, private ShellAdmission $admissions) {}

    /**
     * @throws RetryRefused
     */
    public function handle(RetryProcessRunCommand $command): string
    {
        $lost = ProcessRun::query()->acrossActors()->whereKey($command->runId)->sole();
        $actor = ActorIdentity::of($command->dispatchedBy());

        if (! $this->administration->isGrantedToCaller() && ! $lost->isByActor($actor)) {
            throw RetryRefused::notYours($lost->id);
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
            throw RetryRefused::refused($refusal->code->value, $refusal->reason);
        }

        return $admission->runId;
    }
}
