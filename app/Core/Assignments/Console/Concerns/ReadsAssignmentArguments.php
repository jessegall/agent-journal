<?php

declare(strict_types=1);

namespace App\Core\Assignments\Console\Concerns;

/**
 * The record an assignment command names by its type and id arguments. The launch decides who calls, never an
 * option.
 */
trait ReadsAssignmentArguments
{
    /**
     * @return array{recordType: string, recordId: int}
     */
    protected function recordFields(): array
    {
        return ['recordType' => (string) $this->argument('type'), 'recordId' => (int) $this->argument('id')];
    }
}
