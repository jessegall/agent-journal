<?php

declare(strict_types=1);

namespace App\Navigation\Contracts;

use App\Support\RecordIdentity;
use PhpOption\Option;

/**
 * The data of a window that shows one record: the journal asks what may be offered for that record wherever the
 * window is shown, and offers nothing when the window shows none.
 */
interface RecordWindow
{
    /**
     * The record the window shows, or none.
     *
     * @return Option<RecordIdentity>
     */
    public function shownRecord(): Option;
}
