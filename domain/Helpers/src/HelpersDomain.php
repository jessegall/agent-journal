<?php

declare(strict_types=1);

namespace Domain\Helpers;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class HelpersDomain extends Domain
{
    public function description(): string
    {
        return 'Helper identities, their jobs and purposes, and how a parent dispatches them.';
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
        return Exports::make()->build();
    }
}
