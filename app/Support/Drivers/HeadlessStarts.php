<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Commands\Agents\OpenHeadlessTurn\OpenHeadlessTurnCommand;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Hosts\HostProcessType;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Support\StartClaims;
use App\Values\DriverAccount;
use App\Values\DriverRegistration;
use App\Values\DriverStart;
use App\Values\JournalServer;

/**
 * The start of a headless Claude Code runtime the journal drives itself, as each of its processes runs it: in the
 * runtime's conversation and folder, on the start's account with the journal's server from the host's installation.
 */
final readonly class HeadlessStarts
{
    /**
     * Where the host's protected installation keeps the journal's PHP and its MCP relay, and its hook command.
     */
    private const string INSTALLED_PHP = '{host:INSTALLATION}/bin/php';

    private const string INSTALLED_MCP_RELAY = '{host:INSTALLATION}/journal/bin/journal-mcp';

    private const string HOOK_COMMAND = '{host:HOOK_COMMAND}';

    /**
     * The trusted entry the journal's own commands for headless starts run under.
     */
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(
        private StartClaims $starts,
        private DriverCatalogue $drivers,
        private JournalCommands $commands,
    ) {}

    /**
     * The journal opens the runtime's next turn, when its start is proven, no turn runs and work waits.
     */
    public function openNextTurn(string $runtimeId): void
    {
        $open = new OpenHeadlessTurnCommand($runtimeId);
        $this->commands->runAsJournal(CommandEntry::DriverWorker, self::TRUSTED_ENTRY, $open);
    }

    /**
     * The keys of the drivers whose runtimes the journal drives itself, so no host claims their work.
     *
     * @return list<string>
     */
    public function drivenKeys(): array
    {
        $driven = array_filter(
            $this->drivers->catalogue(),
            fn (DriverRegistration $registration) => $registration->isDrivenByJournal,
        );

        return array_values(array_map(fn (DriverRegistration $registration) => $registration->key->key, $driven));
    }

    /**
     * Whether the journal drives this runtime itself, as its driver's registration says.
     */
    public function drives(AgentRuntime $runtime): bool
    {
        return in_array($runtime->driver_key, $this->drivenKeys(), true);
    }

    public function startOf(
        AgentRuntime $runtime,
        SessionProcess $start,
        string|null $prompt = null,
        string|null $model = null,
        string|null $effort = null,
    ): DriverStart {
        $server = new JournalServer(self::INSTALLED_PHP, self::INSTALLED_MCP_RELAY);
        $account = new DriverAccount($this->starts->recipeOf($start), $runtime->id, $server, folder: $start->directory);

        return new DriverStart(
            sessionId: (string) $runtime->conversation_id,
            type: HostProcessType::Pipe,
            workFolder: $runtime->canonical_folder,
            prompt: $prompt,
            isResume: $this->isResume($runtime),
            model: $model ?? $runtime->requested_model,
            effort: $effort ?? $runtime->requested_effort,
            hookCommand: self::HOOK_COMMAND,
            account: $account,
        );
    }

    /**
     * A turn continues the conversation once a turn of it ran, or from its first turn when the owner chose to resume
     * it.
     */
    private function isResume(AgentRuntime $runtime): bool
    {
        return $runtime->hasRunTurn()
            || SessionRequest::resolveConversationTargetOf($runtime->agent_session_id) === $runtime->conversation_id;
    }
}
