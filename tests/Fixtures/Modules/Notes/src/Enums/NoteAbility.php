<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Enums;

enum NoteAbility: string
{
    case Read = 'read';
    case Edit = 'edit';
}
