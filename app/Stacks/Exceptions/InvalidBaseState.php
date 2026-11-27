<?php

declare(strict_types=1);

namespace App\Stacks\Exceptions;

use App\Stacks\Contracts\BaseStateReference;
use App\Stacks\ReadyState;
use LogicException;

final class InvalidBaseState extends LogicException
{
    public static function for(string $class): self
    {
        return new self(
            "{$class}, named in journal.sessions.base_states, must be a state or reference that implements "
            .BaseStateReference::class.'.',
        );
    }

    public static function notReadyFirst(): self
    {
        return new self('journal.sessions.base_states must start with '.ReadyState::class.', the bottom of every stack.');
    }
}
