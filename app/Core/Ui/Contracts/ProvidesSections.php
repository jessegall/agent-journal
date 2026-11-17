<?php

declare(strict_types=1);

namespace App\Core\Ui\Contracts;

use App\Core\Ui\Declarations\Section;

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
