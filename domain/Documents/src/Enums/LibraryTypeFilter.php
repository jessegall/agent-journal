<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

/**
 * Which records the library lists: documents and reports, only documents, or only reports.
 */
enum LibraryTypeFilter: string
{
    case All = 'all';
    case Documents = 'doc';
    case Reports = 'report';

    public function label(): string
    {
        return match ($this) {
            self::All => 'Documents and reports',
            self::Documents => 'Documents',
            self::Reports => 'Reports',
        };
    }

    public function isForDocuments(): bool
    {
        return $this !== self::Reports;
    }

    public function isForReports(): bool
    {
        return $this !== self::Documents;
    }
}
