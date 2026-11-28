<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\OpenHeadlessTurn;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Work\DriverRequestClaims;
use App\Agents\Drivers\Work\RuntimeStarts;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Sessions\SessionProcess;
use App\Values\HostInstructionSource;

final readonly class OpenHeadlessTurnHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'headless starts';

    private const string OPEN_STEP = 'open';

    private const string APPLIED_AT_NEXT_START = 'next_start';

    public function __construct(
        private DriverRequestClaims $claims,
        private RuntimeStarts $headless,
        private DriverProfiles $profiles,
        private JournalCommands $commands,
    ) {}

    public function handle(OpenHeadlessTurnCommand $command): string|null
    {
        $runtime = AgentRuntime::query()->withSessionAgent()->whereKey($command->runtimeId)->lockForUpdate()->sole();

        $isTurnDue = $runtime->hasProvenStart()
            && ! $runtime->hasLiveProcess(HostProcessPurpose::AgentTurn);

        if (! $isTurnDue) {
            return null;
        }

        $start = SessionProcess::findLockedCurrentOf($runtime->agent_session_id);

        // A runtime whose start ended takes no more work: its turns open only for the start that proved them.
        if ($start === null) {
            return null;
        }

        $work = $this->claims->claimWorkFor(collect([$runtime->id => $runtime]), 1)->requests;
        $model = null;
        $effort = null;

        // A headless runtime runs nothing for a model or effort change: it holds for every start that follows, this
        // turn's first, so the change is applied as it is claimed and the next work is claimed after it.
        while ($work !== [] && DriverOperation::from($work[0]->operation)->changesASetting()) {
            $model = $work[0]->model ?? $model;
            $effort = $work[0]->effort ?? $effort;
            DriverRequest::findLockedById($work[0]->requestId)->markApplied(self::APPLIED_AT_NEXT_START);
            $work = $this->claims->claimWorkFor(collect([$runtime->id => $runtime]), 1)->requests;
        }

        if ($work === []) {
            return null;
        }

        $request = $work[0];
        $prompt = $request->prompt();
        $driverStart = $this->headless->startOf(
            $runtime,
            $start,
            $prompt,
            $request->model ?? $model,
            $request->effort ?? $effort,
        );

        $profile = $this->profiles->of($runtime);
        $environment = $this->headless->clientSettingsOf($runtime)->environment();
        $turn = $profile->startPlan($driverStart)->withEnvironment($environment);

        $source = HostInstructionSource::forStep($request->requestId, self::OPEN_STEP, $request->attempt, 0);

        $open = new OpenHostProcessCommand($runtime->host_id, $runtime->id, $turn, $source, $start->id);

        return $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
    }
}
