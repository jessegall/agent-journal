<?php

declare(strict_types=1);

namespace App\Stacks\Support;

use App\Models\Skills\SkillPublication;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;

/**
 * The stack reference of waiting for one publication of a session's skill set; a publication settles once.
 */
final class AwaitSkillsStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'core.skills.await';
    }

    public static function forPublication(SkillPublication $publication): StateReference
    {
        return self::about(
            new SubjectReference($publication->id, 1),
            ['publicationId' => $publication->id, 'publication' => $publication->status->value],
        );
    }
}
