<?php

declare(strict_types=1);

namespace Tests\Fixtures\Policies;

use App\Contracts\Policy;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * A second policy for the Notes module's model, which the catalogue must refuse.
 */
final readonly class OtherNotePolicy implements Policy
{
    public static function model(): string
    {
        return Note::class;
    }
}
