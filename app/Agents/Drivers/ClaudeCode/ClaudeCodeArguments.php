<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\StartConditions\AccountStart;
use App\Agents\Drivers\StartConditions\CliTransportAccount;
use App\Agents\Drivers\StartConditions\JournalServerAccount;
use App\Agents\Drivers\StartConditions\ResumedStart;
use App\Agents\Drivers\StartConditions\TurnStart;
use App\Support\CommandLines\AnyContext;
use App\Support\CommandLines\Argument;
use App\Support\CommandLines\ArgumentBuilder;
use App\Values\DriverStart;

/**
 * The command line of the pinned Claude Code: isolated settings, no other setting source, the journal's MCP server
 * alone, an explicit tool set without delegation, an exact session id, and the print flags of a turn.
 *
 * @extends ArgumentBuilder<DriverStart>
 */
final readonly class ClaudeCodeArguments extends ArgumentBuilder
{
    public const string EXECUTABLE = 'claude';

    /**
     * The pinned build in the host's protected installation, which every account start runs.
     */
    public const string INSTALLED_EXECUTABLE = '{host:INSTALLATION}/bin/claude';

    public const string SETTINGS = '{folder:files}/settings.json';

    public const string MCP_CONFIG = '{folder:files}/mcp.json';

    protected function arguments(): array
    {
        return [
            Argument::for(new AccountStart(), self::INSTALLED_EXECUTABLE),
            Argument::unless(new AccountStart(), self::EXECUTABLE),
            Argument::for(new AnyContext(), ['--settings', self::SETTINGS, '--setting-sources', '']),
            Argument::unless(new CliTransportAccount(), '--strict-mcp-config'),
            Argument::for(new AnyContext(), [
                '--agents',
                '{}',
                '--tools',
                implode(',', ClaudeCodeTools::ALLOWED),
                '--disallowedTools',
                ...ClaudeCodeTools::DELEGATION,
            ]),
            Argument::for(new JournalServerAccount(), ['--mcp-config', self::MCP_CONFIG]),
            Argument::option(['--model', '{value}'], fn (DriverStart $start) => $start->model),
            Argument::for(new ResumedStart(), fn (DriverStart $start) => [
                '--resume',
                $start->sessionId,
            ]),
            Argument::unless(new ResumedStart(), fn (DriverStart $start) => [
                '--session-id',
                $start->sessionId,
            ]),
            Argument::for(new TurnStart(), ['--print', '--output-format', 'stream-json', '--verbose']),
            Argument::option(['{value}'], fn (DriverStart $start) => $start->prompt),
        ];
    }
}
