<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

use App\Declarations\Section;

/**
 * A domain that fills slots of pages, its own or another domain's, with sections of its own.
 */
interface SectionProvider
{
    /**
     * @return list<Section>
     */
    public function sections(): array;
}
