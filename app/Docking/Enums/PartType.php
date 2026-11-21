<?php

declare(strict_types=1);

namespace App\Docking\Enums;

/**
 * Every kind of part a dock card is built from; the containers hold children, the leaves hold none.
 */
enum PartType: string
{
    case Stack = 'stack';
    case Row = 'row';
    case Group = 'group';
    case Disclosure = 'disclosure';
    case Title = 'title';
    case Subtitle = 'subtitle';
    case StateLabel = 'state-label';
    case CountedProgress = 'counted-progress';
    case IndeterminateProgress = 'indeterminate-progress';
    case Duration = 'duration';
    case ConsoleOutput = 'console-output';
    case ChatExcerpt = 'chat-excerpt';
    case Button = 'button';

    public function isContainer(): bool
    {
        return match ($this) {
            self::Stack, self::Row, self::Group, self::Disclosure => true,
            default => false,
        };
    }
}
