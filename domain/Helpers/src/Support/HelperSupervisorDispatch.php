<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Actors\Contracts\JournalAdmission;
use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Bus\Contracts\CommandBus;
use App\Supervision\Contracts\SupervisorDispatch;
use App\Supervision\Enums\SupervisorDispatchOutcome;
use App\Supervision\Values\SupervisorRequest;
use Domain\Helpers\Commands\StartHelper;
use Domain\Helpers\Exceptions\HelperBusy;
use Illuminate\Database\DatabaseManager;
use Throwable;

/**
 * Retains the start of a supervisor profile's helper for an ask and runs it once the routing transaction committed,
 * through the ordinary helper start under the asking actor's own authority and the profile's activated model. Only an
 * installation with an owner may start one this way; a helper that already works is not started again, so two asks
 * never start a second copy. This is the one boundary where a start that fails is reported and skipped: the ask stays
 * pending and escalates as any other.
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
            $this->commands->run(new StartHelper(
                $request->askId,
                $request->profileKey,
                'default',
                null,
                HelperWork::described(null, null, "Answer ask {$request->askId}", $request->body, [], false),
            ));
        } catch (HelperBusy) {
            return;
        } catch (Throwable $failure) {
            report($failure);
        }
    }
}
