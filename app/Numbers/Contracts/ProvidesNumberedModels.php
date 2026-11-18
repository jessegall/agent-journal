<?php

declare(strict_types=1);

namespace App\Numbers\Contracts;

use App\Numbers\Support\NumberedModel;

/**
 * A domain whose records people refer to by number: each numbered model with what it is numbered within.
 */
interface ProvidesNumberedModels
{
    /**
     * @return list<NumberedModel>
     */
    public function numberedModels(): array;
}
