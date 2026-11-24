<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

use App\Contracts\Bus\CommandFacts;

/**
 * A transaction listener that stages a public occurrence it has no row to raise on.
 */
final readonly class StagesProgress
{
    public function __construct(private CommandFacts $lifecycle) {}

    public function handle(RowRenamed $event): void
    {
        $this->lifecycle->publishAfterCommit(new StreamedRenameNoticed("progress of {$event->name}"));
    }
}
