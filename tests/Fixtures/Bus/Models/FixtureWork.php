<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * The class-level subject of the bus and module fixture commands: the fixture work their policy decides on. It is
 * never stored; only its class is named.
 */
final class FixtureWork extends Model {}
