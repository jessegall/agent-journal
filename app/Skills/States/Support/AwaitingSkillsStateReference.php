<?php

declare(strict_types=1);

namespace App\Skills\States\Support;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferenceFactory;
use App\Hooks\Decisions\SubjectReference;
use App\Skills\Models\SkillPublication;

/**
 * The stack reference of waiting for one publication of a session's skill set; a publication settles once.
 */
final class AwaitingSkillsStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'skills.awaiting';

    public static function forPublication(SkillPublication $publication): StateReference
    {
        return self::about(new SubjectReference($publication->id, 1));
    }
}
