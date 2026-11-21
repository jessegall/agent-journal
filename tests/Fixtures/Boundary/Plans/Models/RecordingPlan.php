<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Plans\Models;

use App\Contracts\EventSource;
use App\Contracts\RaisesEvents;
use Illuminate\Database\Eloquent\Model;

/**
 * A domain model that records its own facts through Core's exported contract and trait.
 */
final class RecordingPlan extends Model implements EventSource
{
    use RaisesEvents;
}
