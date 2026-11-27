<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\AccountPlanPart;
use App\Agents\Exceptions\ProfileRefused;
use App\Agents\Values\PlanFile;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\PlanAddition;

/**
 * The mcp.json of an account start: the journal's server alone, started by a resolved path, with no token,
 * environment or placeholder of the model's.
 */
final readonly class ClaudeCodeJournalServer implements AccountPlanPart
{
    public const string NAME = 'mcp.json';

    public const string PATH = '{folder:files}/'.self::NAME;

    private const string JOURNAL_SERVER = 'journal';

    private const int JOURNAL_TIMEOUT_MS = 30000;

    /**
     * The journal's server descriptor for the account's start.
     *
     * @throws ProfileRefused
     */
    public function __invoke(DriverStart $start, DriverAccount $account): PlanAddition
    {
        $server = ($account->journalServer ?? throw ProfileRefused::unresolvedSetting('no journal MCP server'))
            ->resolved();

        $descriptor = ['mcpServers' => [self::JOURNAL_SERVER => [
            'type' => 'stdio',
            'command' => $server->command,
            'args' => $server->arguments(),
            'timeout' => self::JOURNAL_TIMEOUT_MS,
        ]]];

        return new PlanAddition([PlanFile::template(self::NAME, json_encode(
            $descriptor,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
        ))]);
    }
}
