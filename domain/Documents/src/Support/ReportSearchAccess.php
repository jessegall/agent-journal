<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

/**
 * Who may search reports: an agent whose grant holds reports_read for at least one, limited to those, and every
 * signed-in user of the environment; a hit opens through reports_read, a passage hit at its line.
 */
final readonly class ReportSearchAccess extends PublicationSearchAccess
{
    protected function readName(): string
    {
        return 'reports_read';
    }

    protected function idArgument(): string
    {
        return 'report_id';
    }
}
