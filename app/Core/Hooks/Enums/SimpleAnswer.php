<?php

declare(strict_types=1);

namespace App\Core\Hooks\Enums;

use App\Core\Hooks\Contracts\Answer;

enum SimpleAnswer: string implements Answer
{
    case Delegate = 'delegate';
    case Allow = 'allow';

    public function type(): AnswerType
    {
        return match ($this) {
            self::Delegate => AnswerType::Delegate,
            self::Allow => AnswerType::Allow,
        };
    }
}
