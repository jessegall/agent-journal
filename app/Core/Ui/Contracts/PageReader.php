<?php

declare(strict_types=1);

namespace App\Core\Ui\Contracts;

use Spatie\LaravelData\Data;

/**
 * Reads the data of one page. It is built per request, so its own request class and the actor come through its
 * constructor; an implementation narrows the return type to its concrete Data class.
 */
interface PageReader
{
    public function read(): Data;
}
