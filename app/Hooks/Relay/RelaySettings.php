<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\StartEnvironment;
use App\AgentRequests\Support\StartProfilePin;
use App\Agents\Enums\OfflineReplyMode;
use App\Agents\Exceptions\OfflineReplySealInvalid;
use App\Agents\Support\OfflineReplySeal;
use App\Files\Enums\Place;
use App\Files\Values\FilePath;
use App\Hooks\Support\ProtectedAccounts;

/**
 * What the relay of one start needs, given to the program's environment by the start: where the journal
 * answers, the start token, the sealed offline reply, the host's bypass file and the account folders it refuses on
 * its own while the journal is away.
 */
final readonly class RelaySettings
{
    public function __construct(
        public string $journalUrl,
        public string $token,
        public StartProfilePin $profile,
        public bool $passesOutages,
        public string $bypassLogPath,
        public int $timeoutSeconds = 10,
        public int $processGeneration = 0,
        public ProtectedAccounts $accounts = new ProtectedAccounts([]),
        public string $outputGrantsFile = '',
        public string $startKey = '',
    ) {}

    /**
     * The start's credential with the offline reply and bypass file its environment names; the reply counts only
     * under the seal the journal issued for this start.
     *
     * @throws OfflineReplySealInvalid
     */
    public static function forStart(
        AgentClientSettings $client,
        StartEnvironment $start,
        OfflineReplySeal $seal,
    ): self {
        $mode = OfflineReplyMode::fromStart($start->value('JOURNAL_OFFLINE_REPLY'));
        $seal->verify($client->token, $client->profile, $mode, $start->value('JOURNAL_OFFLINE_REPLY_SEAL'));

        return new self(
            $client->journalUrl,
            $client->token,
            $client->profile,
            $mode->passesOutages(),
            $start->value('JOURNAL_BYPASS_LOG'),
            processGeneration: self::processGenerationOf($start),
            accounts: self::protectedAccountsOf($start),
            outputGrantsFile: self::valueOrEmpty($start, 'JOURNAL_OUTPUT_GRANTS'),
            startKey: self::valueOrEmpty($start, 'JOURNAL_START_KEY'),
        );
    }

    /**
     * The value the host gave the program under the name; empty when it gave none, as for a start with no account.
     */
    private static function valueOrEmpty(StartEnvironment $start, string $name): string
    {
        return $start->has($name) ? $start->value($name) : '';
    }

    /**
     * The process generation the host gave this program, or 0 when the host gave none.
     */
    private static function processGenerationOf(StartEnvironment $start): int
    {
        if (! $start->has('JOURNAL_PROCESS_GENERATION')) {
            return 0;
        }

        return (int) $start->value('JOURNAL_PROCESS_GENERATION');
    }

    /**
     * The account folders the host gave this program, which the relay refuses on its own while the journal is away.
     */
    private static function protectedAccountsOf(StartEnvironment $start): ProtectedAccounts
    {
        $given = array_filter(
            ['JOURNAL_ACCOUNTS_ROOT', 'CLAUDE_CONFIG_DIR', 'CODEX_HOME'],
            fn (string $name) => $start->has($name) && $start->value($name) !== '',
        );

        return new ProtectedAccounts(array_values(array_map(fn (string $name) => $start->value($name), $given)));
    }

    /**
     * The host's runtime folder of this start, which holds the bypass log and the files beside it: the root of the
     * private place hook-runtime.
     */
    public function runtimeFolder(): string
    {
        return dirname($this->bypassLogPath);
    }

    /**
     * The bypass log, in the runtime folder.
     */
    public function bypassLog(): FilePath
    {
        return FilePath::in(Place::HookRuntime, basename($this->bypassLogPath));
    }

    /**
     * The folder of callback envelopes not yet answered, beside the bypass log.
     */
    public function pendingEnvelopesFolder(): FilePath
    {
        return FilePath::in(Place::HookRuntime, basename($this->bypassLogPath).'.pending');
    }

    /**
     * The host file that says whether the program's current context generation is prepared, beside the bypass log.
     */
    public function preparationFile(): FilePath
    {
        return FilePath::in(Place::HookRuntime, basename($this->bypassLogPath).'.preparation.json');
    }

    /**
     * The start's sealed output grants, which the host writes into the same runtime folder.
     */
    public function outputGrants(): FilePath
    {
        return FilePath::in(Place::HookRuntime, basename($this->outputGrantsFile));
    }

    /**
     * The hook path, with the process generation the host gave this program when it has one, so the server can refuse
     * a call from an older process (doc 40, section 12).
     */
    public function hookPath(string $program): string
    {
        $query = $this->processGeneration > 0 ? ['generation' => $this->processGeneration] : [];

        return route('hooks.answer', ['program' => $program, ...$query], false);
    }

    public function client(): AgentClientSettings
    {
        return new AgentClientSettings($this->journalUrl, $this->token, $this->profile, $this->timeoutSeconds);
    }
}
