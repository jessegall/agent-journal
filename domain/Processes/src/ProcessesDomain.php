<?php

declare(strict_types=1);

namespace Domain\Processes;

use App\Domains\Support\Domain;

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

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }
}
