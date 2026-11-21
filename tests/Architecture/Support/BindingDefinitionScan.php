<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\FileScan;

/**
 * The container bindings a file registers, through an attribute or a provider call.
 *
 * @implements FileScan<BindingDefinition>
 */
final readonly class BindingDefinitionScan implements FileScan
{
    public function key(): string
    {
        return 'binding-definitions-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return BindingRules::definitionsIn($file);
    }
}
