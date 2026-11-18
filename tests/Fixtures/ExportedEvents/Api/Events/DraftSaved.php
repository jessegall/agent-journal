<?php

declare(strict_types=1);

namespace Tests\Fixtures\ExportedEvents\Api\Events;

use App\Contracts\Event;

/**
 * An event a fixture domain keeps in Api/Events without exporting it: the folder alone does not make it public.
 */
final readonly class DraftSaved implements Event
{
    public function __construct(public string $draftId) {}
}
