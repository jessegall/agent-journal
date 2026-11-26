<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Engine\Enums\NoSubject;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;

/**
 * The stack reference of writing a note.
 */
final class WriteNoteStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'notes.writing';
    }

    public static function withoutSubject(): StateReference
    {
        return self::about(NoSubject::None);
    }
}
