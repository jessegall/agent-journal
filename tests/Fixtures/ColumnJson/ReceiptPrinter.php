<?php

declare(strict_types=1);

namespace Tests\Fixtures\ColumnJson;

/**
 * A class that keeps no columns and writes JSON for a printer, which passes.
 */
final readonly class ReceiptPrinter
{
    /**
     * @param  list<string>  $lines
     */
    public function payload(array $lines): string
    {
        return json_encode($lines, JSON_THROW_ON_ERROR);
    }
}
