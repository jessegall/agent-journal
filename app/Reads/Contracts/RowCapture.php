<?php

declare(strict_types=1);

namespace App\Reads\Contracts;

use App\Contracts\Events\EventSource;
use Illuminate\Database\Eloquent\Model;

/**
 * Takes each write of an event source into the event unit of its connection, the one path its facts reach the bus.
 */
interface RowCapture
{
    /**
     * Takes note of a row that was just saved, so its facts are raised.
     */
    public function persisted(Model&EventSource $row): void;
}
