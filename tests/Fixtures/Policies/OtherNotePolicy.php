<?php

declare(strict_types=1);

namespace Tests\Fixtures\Policies;

use App\Actors\Contracts\Policy;

/**
 * A second policy for the Notes module's model, which the catalogue must refuse.
 */
final readonly class OtherNotePolicy implements Policy {}
