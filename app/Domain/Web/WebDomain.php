<?php

declare(strict_types=1);

namespace App\Domain\Web;

use App\Domain\Access\AccessDomain;
use App\Domain\Domain;
use App\Domain\Plans\PlansDomain;

final class WebDomain implements Domain
{
    public function description(): string
    {
        return 'The browser interface: pages, routes and the data each page shows; no domain depends on it.';
    }

    /**
     * Approved in question 13; Chat and Rules join as the pages that use them are built.
     *
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [AccessDomain::class, PlansDomain::class];
    }
}
