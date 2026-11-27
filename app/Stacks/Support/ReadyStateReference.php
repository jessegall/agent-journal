<?php

declare(strict_types=1);

namespace App\Stacks\Support;

use App\Engine\Enums\NoSubject;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Values\StackTarget;

/**
 * The stack reference of the permanent bottom of every stack.
 */
final class ReadyStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'core.ready';
    }

    /**
     * The bottom of the session's stack.
     */
    public static function bottomOf(StackTarget $target): StateReference
    {
        return self::about(NoSubject::None, self::valuesOf($target));
    }

    /**
     * The values the bottom state of the stack is built with: its agent and its session.
     *
     * @return array{agentId: string, sessionId: string}
     */
    public static function valuesOf(StackTarget $target): array
    {
        return ['agentId' => $target->agentId, 'sessionId' => $target->sessionId];
    }
}
