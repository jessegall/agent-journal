<?php

declare(strict_types=1);

namespace Tests\Fixtures\AgentRequests;

use Spatie\LaravelData\Data;

/**
 * The answer of the fixture calls: the note's id.
 */
final class NoteAnswer extends Data
{
    public function __construct(public string $noteId) {}
}
