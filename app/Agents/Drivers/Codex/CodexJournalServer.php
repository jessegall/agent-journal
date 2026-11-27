<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Contracts\AccountPlanPart;
use App\Agents\Exceptions\ProfileRefused;
use App\Agents\Values\PlanFile;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Hosts\Protocol\ContainedPlanFields;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use App\Values\FilePath;
use App\Values\PlanAddition;

/**
 * The journal's server for a contained Codex, whatever account it runs on: a system config the container mounts where
 * Codex reads it, naming the relay and the start grant's variables, as Codex hands a server no other.
 */
final readonly class CodexJournalServer implements AccountPlanPart
{
    /**
     * The plan file of the system config, and where Codex reads it in its container.
     */
    public const string FILE = 'codex-config.toml';

    public const string TARGET = '/etc/codex/config.toml';

    private const string TEMPLATE = 'resources/agents/codex-journal-server.toml';

    public function __construct(private Files $files) {}

    /**
     * @throws ProfileRefused
     */
    public function __invoke(DriverStart $start, DriverAccount $account): PlanAddition
    {
        $server = ($account->journalServer ?? throw ProfileRefused::unresolvedSetting('no journal MCP server'))
            ->resolved();

        $config = strtr($this->files->read(FilePath::in(Place::Project, self::TEMPLATE)), [
            '{command}' => self::encode($server->command),
            '{arguments}' => self::encode($server->arguments()),
            '{variables}' => self::encode(ContainedPlanFields::START_GRANT_ENVIRONMENT),
        ]);

        return new PlanAddition([PlanFile::template(self::FILE, $config)]);
    }

    /**
     * A string or a list of strings as TOML writes it, which is how JSON writes them.
     *
     * @param  string|list<string>  $value
     */
    private static function encode(string|array $value): string
    {
        return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
}
