<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

enum SimpleAnswer: string implements Answer
{
    case Delegate = 'delegate';
    case Allow = 'allow';

    public function label(): string
    {
        return $this->value;
    }
}
