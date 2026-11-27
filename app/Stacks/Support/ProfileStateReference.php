<?php

declare(strict_types=1);

namespace App\Stacks\Support;

use App\Stacks\Contracts\BaseStateReference;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Values\StackTarget;

/**
 * Builds the profile state of one session's stack, which holds its stops to the session's profile.
 */
final class ProfileStateReference extends StateReferenceFactory implements BaseStateReference
{
    public static function key(): string
    {
        return 'core.profile';
    }

    public static function forSession(StackTarget $target): StateReference
    {
        return self::about(new SubjectReference($target->sessionId, 0), [
            'agentId' => $target->agentId,
            'sessionId' => $target->sessionId,
        ]);
    }
}
