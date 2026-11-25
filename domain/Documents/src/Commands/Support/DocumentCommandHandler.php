<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\Support;

use App\Contracts\Bus\CommandHandler;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Models\Document;

/**
 * The base of every Documents handler, with the revision check opening and settling a document share.
 */
abstract readonly class DocumentCommandHandler implements CommandHandler
{
    /**
     * Refuses a change made against another revision than the locked document's current one.
     *
     * @throws StaleRead
     */
    final protected function assertDocumentRevision(Document $document, int $expectedRevision): void
    {
        $current = $document->currentRevisionOrFail()->number;

        if ($current !== $expectedRevision) {
            throw StaleRead::revision($expectedRevision, $current);
        }
    }
}
