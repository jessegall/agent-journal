<?php

declare(strict_types=1);

namespace Tests\Fixtures\RaiseCallers\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A model whose ship transition raises a fact.
 *
 * @property bool $shipped
 */
final class Shipment extends Model
{
    public function ship(): void
    {
        $this->shipped = true;
        $this->save();
    }
}
