<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

/**
 * One domain of the application: what it owns and the domains it may use.
 */
interface Domain
{
    public function description(): string;

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array;

    /**
     * The domain's public surface: every class, interface, enum or exception another domain may use, written out one by
     * one. An empty list is a domain nothing outside may use; there is no wildcard.
     *
     * @return list<class-string>
     */
    public function exports(): array;
}
