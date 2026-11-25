<?php

declare(strict_types=1);

namespace Tests\Fixtures\Projects;

use App\Contracts\Projects\ProjectCommand;
use App\Support\Command;
use App\Values\ProjectOwner;

/**
 * A write of a record of the owner given, as a guard test hands it to the project guard alone.
 *
 * @extends Command<null>
 */
final readonly class OwnedWrite extends Command implements ProjectCommand
{
    public function __construct(private ProjectOwner $writtenOwner) {}

    public function owner(): ProjectOwner
    {
        return $this->writtenOwner;
    }
}
