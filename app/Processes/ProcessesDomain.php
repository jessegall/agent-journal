<?php

declare(strict_types=1);

namespace App\Processes;

use App\Domains\Domain;

final class ProcessesDomain implements Domain
{
    public function description(): string
    {
        return 'Shell commands run through the journal, their output, saved commands and readers.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }
}
