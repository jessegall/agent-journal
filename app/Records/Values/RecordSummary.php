<?php

declare(strict_types=1);

namespace App\Records\Values;

/**
 * A record as a short card shows it anywhere: its title, where it stands, a few lines under it, how far it got, how
 * long it ran and the page that opens it. Its owner fills it with neutral values; whoever shows it decides the look.
 */
final readonly class RecordSummary
{
    /**
     * @param  list<SummaryLine>  $lines
     */
    public function __construct(
        public string $id,
        public string $title,
        public RecordStanding|null $standing = null,
        public array $lines = [],
        public SummaryProgress|null $progress = null,
        public SummaryPeriod|null $period = null,
        public SummaryPage|null $page = null,
    ) {}
}
