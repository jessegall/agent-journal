<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A deck of cards, the class-level subject of the Cards commands; it is never stored, only its class is named.
 */
final class Deck extends Model {}
