<?php

declare(strict_types=1);

namespace Tests\Fixtures\ExportedEvents\Support;

use App\Contracts\Event;

/**
 * An event a fixture domain exports from outside any Events folder: the exports list, not the folder, makes it public.
 */
final readonly class ReportReady implements Event
{
    public function __construct(public string $reportId) {}
}
