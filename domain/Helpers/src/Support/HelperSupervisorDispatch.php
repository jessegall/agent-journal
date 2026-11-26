<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Access\Contracts\JournalAdmission;
use App\Asks\Enums\SupervisorDispatchOutcome;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\ConsoleOwnerMissing;
use App\Processes\Contracts\SupervisorDispatch;
use App\Processes\Values\SupervisorRequest;
use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\Exceptions\HelperBusy;
use Domain\Helpers\Values\HelperWork;
use Illuminate\Database\DatabaseManager;
use Throwable;

/**
 * Starts a supervisor profile's helper for an ask once the routing transaction committed, under the asking actor's
 * authority, and only on an installation with an owner; a working helper is not started again. A start that fails here
 * is reported and skipped, and the ask escalates as any other.
 */
final readonly class HelperSupervisorDispatch implements SupervisorDispatch
{
    public function __construct(
        private CommandBus $commands,
        private JournalAdmission $admission,
        private DatabaseManager $database,
    ) {}

    public function startFor(SupervisorRequest $request): SupervisorDispatchOutcome
    {
        try {
            $this->admission->owner();
        } catch (ConsoleOwnerMissing) {
            return SupervisorDispatchOutcome::Unavailable;
        }

        $this->database->afterCommit(fn () => $this->start($request));

        return SupervisorDispatchOutcome::Started;
    }

    private function start(SupervisorRequest $request): void
    {
        try {
            $this->commands->run(new StartHelperCommand(
                $request->askId,
                $request->profileKey,
                'default',
                null,
                HelperWork::described(null, null, "Answer ask {$request->askId}", $request->body, [], false),
                $request->projectId,
            ));
        } catch (HelperBusy) {
            return;
        } catch (Throwable $failure) {
            report($failure);
        }
    }
}
