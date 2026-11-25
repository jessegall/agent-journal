<?php

declare(strict_types=1);

namespace App\Support\Decisions\Enums;

use App\Contracts\Asks\Answer;
use App\Enums\Hooks\AnswerType;

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
