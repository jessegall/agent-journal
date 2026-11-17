<?php

declare(strict_types=1);

namespace App\Core\Ui\Contracts;

use App\Core\Ui\Declarations\Page;

/**
 * A domain that brings pages of its own; Web registers a route for each and serves it through its page controller.
 */
interface ProvidesPages
{
    /**
     * @return list<Page>
     */
    public function pages(): array;
}
