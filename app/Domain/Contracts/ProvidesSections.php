<?php

declare(strict_types=1);

namespace App\Domain\Contracts;

use App\Domain\Declarations\Section;

/**
 * A domain that fills slots of pages, its own or another domain's, with sections of its own.
 */
interface ProvidesSections
{
    /**
     * @return list<Section>
     */
    public function sections(): array;
}
