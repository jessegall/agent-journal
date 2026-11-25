<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf;

use App\Contracts\Navigation\ClientUpdate;

/**
 * A fact of a module Web knows nothing about, which changes what users see.
 */
final readonly class ShelfMoved implements ClientUpdate{}
