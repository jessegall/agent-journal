<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may run the notes commands: every granted actor, so the grants decide.
 */
final readonly class NoteWorkPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
