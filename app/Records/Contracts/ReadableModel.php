<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use App\Records\Values\ReadOrder;

/**
 * A model whose plain reads have a default order: the order rows are read in when a read names none.
 */
interface ReadableModel
{
    /**
     * The order rows of the model are read in when a read names none.
     */
    public function defaultReadOrder(): ReadOrder;
}
