<?php

declare(strict_types=1);

namespace App\Sequences;

use App\Domains\Domain;

final class SequencesDomain implements Domain
{
    public function description(): string
    {
        return 'Steps an agent follows one at a time.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }
}
