<?php

declare(strict_types=1);

namespace App\Terminals\KeyScripts;

use App\Navigation\Enums\NavigationKey;

/**
 * A recorded recipe for one driver build: its name, the parameters it is given and its ordered steps. It holds no
 * shell command and no credential, and runs only from a ready prompt.
 */
final readonly class KeyScript
{
    /**
     * @param  list<string>  $parameters
     * @param  list<KeyStep>  $steps
     */
    public function __construct(
        public string $name,
        public string $driver,
        public string $build,
        public array $parameters,
        public array $steps,
    ) {}

    /**
     * The steps that type a slash command at a ready prompt and run it once its echo shows.
     *
     * @return list<KeyStep>
     */
    public static function command(string $command, string $echo): array
    {
        return [
            KeyStep::press("type {$command}", ScreenExpectation::ready(), $command),
            KeyStep::press("run {$command}", ScreenExpectation::shows($echo), NavigationKey::Enter->bytes()),
        ];
    }
}
