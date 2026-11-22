<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Declarations\Page;

/**
 * A domain that brings pages of its own; Web registers a route for each and serves it through its page controller.
 */
interface PageProvider
{
    /**
     * @return list<Page>
     */
    public function pages(): array;
}
