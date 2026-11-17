<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * What an event call passes as its event: a written name, a class, the event a listener received, or something else.
 */
enum EventArgument: string
{
    case String = 'string';
    case StringList = 'string-list';
    case ClassName = 'class-name';
    case ListenerParameter = 'listener-parameter';
    case Other = 'other';

    public function isWrittenName(): bool
    {
        return match ($this) {
            self::String, self::StringList => true,
            self::ClassName, self::ListenerParameter, self::Other => false,
        };
    }
}
