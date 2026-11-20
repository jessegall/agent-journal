<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\FileScan;

/**
 * The container bindings a file registers, through an attribute or a provider call.
 *
 * @implements FileScan<BindingRegistration>
 */
final readonly class BindingRegistrationScan implements FileScan
{
    public function key(): string
    {
        return 'binding-registrations-2';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return BindingRules::registrationsIn($file);
    }
}
