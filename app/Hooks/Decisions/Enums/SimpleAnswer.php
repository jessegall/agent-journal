<?php

declare(strict_types=1);

namespace App\Hooks\Decisions\Enums;

use App\Hooks\Contracts\Answer;
use App\Hooks\Enums\AnswerType;

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
