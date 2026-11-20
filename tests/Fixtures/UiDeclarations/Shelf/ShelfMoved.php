<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A fact of a module Web knows nothing about, which changes what users see.
 */
final readonly class ShelfMoved implements ShouldDispatchAfterCommit, UserInterfaceUpdater {}
