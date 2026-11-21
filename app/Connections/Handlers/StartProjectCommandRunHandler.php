<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\StartProjectCommandRun;
use App\Connections\Enums\CommandRunState;
use App\Connections\Exceptions\VerbNotServed;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectCommandRun;
use App\Connections\Support\CommandRunEvidence;
use App\Connections\Values\CommandRunStart;
use App\Contracts\CommandHandler;

/**
 * Locks the request id's run. An earlier run of another operation is refused before anything of it is shown; one of
 * the same operation is reconciled with what can be proved of its worker and process, then answered. With none, the
 * run's intent is kept before its process starts.
 */
final readonly class StartProjectCommandRunHandler implements CommandHandler
{
    public function __construct(private CommandRunEvidence $evidence) {}

    public function handle(StartProjectCommandRun $command): CommandRunStart
    {
        foreach (ProjectCommandRun::lockByRequest($command->requestKey) as $earlier) {
            if (! $earlier->isOfOperation($command->fingerprint)) {
                throw VerbNotServed::anotherOperation($command->requestKey);
            }

            $earlier->reconcile($this->evidence);

            return new CommandRunStart(false, $earlier->state, $earlier->recordedFrames());
        }

        $binding = ProjectBinding::lockById($command->bindingId);
        ProjectCommandRun::create(
            $command->requestKey,
            $command->agentId,
            $binding,
            $command->argv,
            $command->fingerprint,
            $command->worker,
        );

        return new CommandRunStart(true, CommandRunState::Running, []);
    }
}
