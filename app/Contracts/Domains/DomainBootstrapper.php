<?php

declare(strict_types=1);

namespace App\Contracts\Domains;

use App\Support\DomainEntry;

/**
 * One step a domain runs every time the application boots, such as loading its migrations or registering its
 * numbered models; the container builds it, so it asks for what it needs in its constructor.
 */
interface DomainBootstrapper
{
    /**
     * Boots one registered domain: registers what it declares.
     */
    public function __invoke(DomainEntry $domain): void;
}
