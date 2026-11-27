<?php

declare(strict_types=1);

namespace App\Sessions\States\Support;

use App\Engine\Enums\NoSubject;
use App\Stacks\Contracts\BaseStateReference;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Values\StackTarget;

/**
 * The stack reference of the permanent bottom of every stack.
 */
final class ReadyStateReference extends StateReferenceFactory implements BaseStateReference
{
    public static function key(): string
    {
        return 'core.ready';
    }

    /**
     * The bottom of the session's stack, built with its agent and its session.
     */
    public static function forSession(StackTarget $target): StateReference
    {
        return self::about(NoSubject::None, ['agentId' => $target->agentId, 'sessionId' => $target->sessionId]);
    }
}
