<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

/**
 * Who may search documents: an agent whose grant holds docs_read for at least one, limited to those, and every
 * signed-in user of the environment; a hit opens through docs_read, a passage hit at its line.
 */
final readonly class DocumentSearchAccess extends PublicationSearchAccess
{
    protected function readName(): string
    {
        return 'docs_read';
    }

    protected function idArgument(): string
    {
        return 'doc_id';
    }
}
