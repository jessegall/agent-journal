<?php

declare(strict_types=1);

namespace App\Domain\Web;

use App\Domain\Access\AccessDomain;
use App\Domain\Chat\ChatDomain;
use App\Domain\Contracts\Domain;
use App\Domain\Plans\PlansDomain;
use App\Domain\Rules\RulesDomain;

final class WebDomain implements Domain
{
    public function description(): string
    {
        return 'The browser interface: pages, routes and the data each page shows; no domain depends on it.';
    }

    /**
     * Approved in question 13.
     *
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [AccessDomain::class, ChatDomain::class, PlansDomain::class, RulesDomain::class];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }
}
