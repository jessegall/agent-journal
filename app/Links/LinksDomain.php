<?php

declare(strict_types=1);

namespace App\Links;

use App\Domains\Domain;

final class LinksDomain implements Domain
{
    public function description(): string
    {
        return 'The links between any two models.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }
}
