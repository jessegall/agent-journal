<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Api\NoteValue;
use Tests\Fixtures\Modules\Notes\Contracts\NoteResolver;

/**
 * The module's private reader of its own table.
 */
final readonly class NoteRecords implements NoteResolver
{
    public function __construct(private ConnectionInterface $database) {}

    public function note(string $noteId): NoteValue
    {
        $text = (string) $this->database->table('module_notes')->where('id', $noteId)->value('text');

        return new NoteValue($noteId, $text);
    }
}
