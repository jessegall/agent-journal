<?php

declare(strict_types=1);

namespace Tests\Fixtures\MutationDocs;

use Illuminate\Database\Eloquent\Model;

/**
 * A model with one mutation documented in a line, one in two lines with a tag, one with no doc comment and one whose
 * doc comment runs to three lines.
 *
 * @property string $state
 */
final class FixtureLetter extends Model
{
    // ----------[ Mutations ]----------

    /**
     * The letter is written and waits to be sent.
     */
    public function write(): void
    {
        $this->state = 'written';
    }

    /**
     * The letter is read: its reader is kept, and a letter read twice
     * keeps its first reader.
     *
     * @throws \LogicException never
     */
    public function read(): void
    {
        $this->state = 'read';
    }

    public function send(): void
    {
        $this->state = 'sent';
    }

    /**
     * The letter is archived.
     * Its sender is no longer told of it.
     * Its reader keeps reading it.
     */
    public function archive(): void
    {
        $this->state = 'archived';
    }

    // ----------[ Getters ]----------

    public function isSent(): bool
    {
        return $this->state === 'sent';
    }
}
