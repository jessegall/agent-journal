<?php

declare(strict_types=1);

namespace Tests\Support\Docker;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\Yaml\Yaml;

/**
 * The folders the agent daemon's machine holds, as the agent-docker service of a compose file is given them.
 */
final readonly class AgentDaemonFolders
{
    private const string DAEMON_SERVICE = 'agent-docker';

    /**
     * A volume's target: the absolute path after its source, before any read-only or read-write mode.
     */
    private const string VOLUME_TARGET = '#:(/[^:]+)(?::r[ow])?$#';

    /**
     * @return list<string>
     */
    public static function of(string $composeFile): array
    {
        /** @var array{services: array<string, array{volumes: list<string>}>} $compose */
        $compose = Yaml::parse(File::get($composeFile));

        return array_values(array_map(
            fn (string $volume): string => Str::of($volume)->match(self::VOLUME_TARGET)->value(),
            $compose['services'][self::DAEMON_SERVICE]['volumes'],
        ));
    }
}
