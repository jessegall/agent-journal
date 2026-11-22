<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Contracts\UserInterfaceUpdater;

/**
 * A fact of a module Web knows nothing about, which changes what users see.
 */
final readonly class ShelfMoved implements UserInterfaceUpdater{}
