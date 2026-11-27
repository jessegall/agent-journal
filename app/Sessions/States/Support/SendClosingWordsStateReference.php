<?php

declare(strict_types=1);

namespace App\Sessions\States\Support;

use App\Stacks\Contracts\BaseStateReference;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Values\StackTarget;

/**
 * Builds the closing-words state of one session's stack.
 */
final class SendClosingWordsStateReference extends StateReferenceFactory implements BaseStateReference
{
    public static function key(): string
    {
        return 'core.closing_words';
    }

    public static function forSession(StackTarget $target): StateReference
    {
        return self::about(new SubjectReference($target->sessionId, 0), [
            'agentId' => $target->agentId,
            'sessionId' => $target->sessionId,
        ]);
    }
}
