<?php

declare(strict_types=1);

namespace App\Commands\Agents\OpenHeadlessTurn;

use App\Commands\Hosts\OpenHostProcess\OpenHostProcessCommand;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Support\AgentClientSettings;
use App\Support\Drivers\DriverRequestClaims;
use App\Support\Drivers\HeadlessStarts;
use App\Support\Drivers\Profiles\ClaudeCodeProfile;
use App\Support\SessionTokens;
use App\Support\StartProfilePin;
use App\Values\HostOrderSource;

final readonly class OpenHeadlessTurnHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'headless starts';

    private const string OPEN_STEP = 'open';

    private const string JOURNAL_URL = '{host:JOURNAL_URL}';

    public function __construct(
        private DriverRequestClaims $claims,
        private HeadlessStarts $headless,
        private ClaudeCodeProfile $profile,
        private SessionTokens $tokens,
        private JournalCommands $commands,
    ) {}

    public function handle(OpenHeadlessTurnCommand $command): string|null
    {
        $runtime = AgentRuntime::query()->withSessionAgent()->whereKey($command->runtimeId)->lockForUpdate()->sole();

        if (! $this->headless->drives($runtime) || ! $runtime->hasProvenStart() || $runtime->hasLiveTurn()) {
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

        $turn = $this->profile->startPlan($driverStart)
            ->withEnvironment($this->credentialsOf($runtime)->environment());

        $source = HostOrderSource::forStep($request->requestId, self::OPEN_STEP, $request->attempt, 0);

        $open = new OpenHostProcessCommand($runtime->host_id, $runtime->id, $turn, $source, $start->id);

        return $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
    }

    /**
     * The first turn takes the start's grant; each later turn a fresh token, as the turn before it has ended.
     */
    private function credentialsOf(AgentRuntime $runtime): AgentClientSettings
    {
        $session = $runtime->session;
        $token = $runtime->claimStartGrant() ?? $this->tokens->rotate($session);
        $profile = new StartProfilePin($session->profile_key, $session->profile_revision);

        return new AgentClientSettings(self::JOURNAL_URL, $token, $profile);
    }
}
