<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * How code uses a table, as fine as the table rules decide on.
 */
enum TableKind: string
{
    case Create = 'create';
    case Read = 'read';
    case ForeignKey = 'foreign-key';
    case Pivot = 'pivot';
    case ModelTable = 'model-table';
    case Change = 'change';
    case NotWritten = 'not-written';
    case PivotNotWritten = 'pivot-not-written';

    /**
     * A declared domain's table may be read, keyed or joined, but only its owner changes it or names it as its model table.
     */
    public function isAllowedOnDeclaredTable(): bool
    {
        return match ($this) {
            self::Read, self::ForeignKey, self::Pivot => true,
            self::Create, self::ModelTable, self::Change, self::NotWritten, self::PivotNotWritten => false,
        };
    }
}
