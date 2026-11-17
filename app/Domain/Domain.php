<?php

declare(strict_types=1);

namespace App\Domain;

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
}
