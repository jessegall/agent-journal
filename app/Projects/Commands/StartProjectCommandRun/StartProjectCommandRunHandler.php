<?php

declare(strict_types=1);

namespace App\Projects\Commands\StartProjectCommandRun;

use App\Bus\Contracts\CommandHandler;
use App\Connections\Enums\CommandRunStatus;
use App\Exceptions\VerbNotServed;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectCommandRun;
use App\Projects\CommandRunEvidence;
use App\Projects\Values\CommandRunStart;

/**
 * Locks the request id's run. An earlier run of another operation is refused before anything of it is shown; one of
 * the same operation is reconciled with what can be proved of its worker and process, then answered. With none, the
 * run's intent is kept before its process starts.
 */
final readonly class StartProjectCommandRunHandler implements CommandHandler
{
    public function __construct(private CommandRunEvidence $evidence) {}

    public function handle(StartProjectCommandRunCommand $command): CommandRunStart
    {
        foreach (ProjectCommandRun::findLockedByRequest($command->requestKey) as $earlier) {
            if (! $earlier->isOfOperation($command->fingerprint)) {
                throw VerbNotServed::anotherOperation($command->requestKey);
            }

            $earlier->reconcile($this->evidence);

            return new CommandRunStart(false, $earlier->status, $earlier->recordedFrames());
        }

        $binding = ProjectBinding::findLockedById($command->bindingId);

        ProjectCommandRun::create(
            $command->requestKey,
            $command->agentId,
            $binding,
            $command->argv,
            $command->fingerprint,
            $command->worker,
        );

        return new CommandRunStart(true, CommandRunStatus::Running, []);
    }
}
