<?php

declare(strict_types=1);

namespace Domain\Documents\Api\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A draft was saved at a new version. It carries ids and the version, never the text.
 */
final readonly class DocumentDraftSaved implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public string $documentId, public int $version) {}
}
