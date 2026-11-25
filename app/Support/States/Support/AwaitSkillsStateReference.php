<?php

declare(strict_types=1);

namespace App\Support\States\Support;

use App\Models\Skills\SkillPublication;
use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;

/**
 * The stack reference of waiting for one publication of a session's skill set; a publication settles once.
 */
final class AwaitSkillsStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'core.skills.await';

    public static function forPublication(SkillPublication $publication): StateReference
    {
        return self::about(
            new SubjectReference($publication->id, 1),
            [
                'publicationId' => $publication->id,
                'publication' => $publication->state->value,
            ],
        );
    }
}
