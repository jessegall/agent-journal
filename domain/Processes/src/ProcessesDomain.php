<?php

declare(strict_types=1);

namespace Domain\Processes;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class ProcessesDomain extends Domain
{
    public function description(): string
    {
        return 'Shell commands run through the journal, their output, command aliases and readers.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
