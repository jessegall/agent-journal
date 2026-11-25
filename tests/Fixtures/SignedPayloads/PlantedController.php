<?php

declare(strict_types=1);

namespace Tests\Fixtures\SignedPayloads;

use Tests\Fixtures\AgentRequests\NoteAnswer;

/**
 * A planted signed controller whose first parameter is not its call.
 */
final readonly class PlantedController
{
    public function __invoke(string $text): NoteAnswer
    {
        return new NoteAnswer($text);
    }
}
