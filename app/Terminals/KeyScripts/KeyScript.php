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
     * The marks around pasted text, as a terminal in bracketed paste mode reads it.
     */
    public const string PASTE_START = "\e[200~";

    public const string PASTE_END = "\e[201~";

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
     * The steps that paste a slash command at a ready prompt and run it once each word of its echo shows: pasted, the
     * text reaches the composer whole, and a driver that draws a hint between the command and its value still shows
     * both words.
     *
     * @return list<KeyStep>
     */
    public static function pastedCommand(string $command, string ...$echo): array
    {
        return [
            KeyStep::press("paste {$command}", ScreenExpectation::ready(), self::PASTE_START.$command.self::PASTE_END),
            KeyStep::press("run {$command}", ScreenExpectation::shows(...$echo), NavigationKey::Enter->bytes()),
        ];
    }

    /**
     * The steps that type a slash command at a ready prompt and run it once its echo shows.
     *
     * @return list<KeyStep>
     */
    public static function command(string $command, string ...$echo): array
    {
        return [
            KeyStep::press("type {$command}", ScreenExpectation::ready(), $command),
            KeyStep::press("run {$command}", ScreenExpectation::shows(...$echo), NavigationKey::Enter->bytes()),
        ];
    }
}
