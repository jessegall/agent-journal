<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Plans\Skills;

use Tests\Fixtures\Boundary\Chat\Message;

/**
 * A domain skill whose text names another domain's class without its domain declaring that one.
 */
final class PlanSkillReadingChat
{
    public function description(): string
    {
        return 'Answer like '.Message::class;
    }
}
