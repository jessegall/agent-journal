<?php

declare(strict_types=1);

namespace App\Enums\Agents;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What an agent did: read a file, ran a command, edited a file, started or finished a helper, or posted a message.
 */
#[TypeScript]
enum ActivityType: string
{
    case Read = 'read';
    case Ran = 'ran';
    case Edited = 'edited';
    case HelperStarted = 'helper_started';
    case HelperFinished = 'helper_finished';
    case Posted = 'posted';

    /**
     * The kit icon the Activity window draws beside the entry.
     */
    public function icon(): string
    {
        return match ($this) {
            self::Read => 'file',
            self::Ran => 'term',
            self::Edited => 'pencil',
            self::HelperStarted => 'agents',
            self::HelperFinished => 'tick',
            self::Posted => 'speech',
        };
    }

    /**
     * The word the entry starts with.
     */
    public function verb(): string
    {
        return match ($this) {
            self::Read => 'Read',
            self::Ran => 'Ran',
            self::Edited => 'Edited',
            self::HelperStarted => 'Started',
            self::HelperFinished => 'Finished',
            self::Posted => 'Posted',
        };
    }

    public function defaultLevel(): ActivityLevel
    {
        return match ($this) {
            self::Read => ActivityLevel::Detail,
            self::Ran, self::Edited, self::HelperStarted, self::HelperFinished => ActivityLevel::Panel,
            self::Posted => ActivityLevel::Notable,
        };
    }
}
