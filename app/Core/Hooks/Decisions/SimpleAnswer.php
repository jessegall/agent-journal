<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

enum SimpleAnswer: string implements Answer
{
    case Delegate = 'delegate';
    case Allow = 'allow';

    public function kind(): AnswerKind
    {
        return match ($this) {
            self::Delegate => AnswerKind::Delegate,
            self::Allow => AnswerKind::Allow,
        };
    }
}
