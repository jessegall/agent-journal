<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenHeadlessTurn;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Work\DriverRequestClaims;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Values\HostInstructionSource;

final readonly class OpenHeadlessTurnHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'headless starts';

    private const string OPEN_STEP = 'open';

    public function __construct(
        private DriverRequestClaims $claims,
        private HeadlessStarts $headless,
        private DriverProfiles $profiles,
        private JournalCommands $commands,
    ) {}

    public function handle(OpenHeadlessTurnCommand $command): string|null
    {
        $runtime = AgentRuntime::query()->withSessionAgent()->whereKey($command->runtimeId)->lockForUpdate()->sole();

        $isTurnDue = $this->headless->drives($runtime)
            && $runtime->hasProvenStart()
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

        if ($work === []) {
            return null;
        }

        $request = $work[0];
        $prompt = $request->prompt();
        $driverStart = $this->headless->startOf($runtime, $start, $prompt, $request->model, $request->effort);

        $profile = $this->profiles->of($runtime);
        $environment = $this->headless->clientSettingsOf($runtime)->environment();
        $turn = $profile->startPlan($driverStart)->withEnvironment($environment);

        $source = HostInstructionSource::forStep($request->requestId, self::OPEN_STEP, $request->attempt, 0);

        $open = new OpenHostProcessCommand($runtime->host_id, $runtime->id, $turn, $source, $start->id);

        return $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
    }
}
