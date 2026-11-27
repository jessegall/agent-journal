<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\Actor;
use App\Models\Projects\Project;
use App\Projects\Contracts\ProjectOwned;
use App\Values\ProjectOwner;

/**
 * The installation's own project as projects:local-provision makes it, made on first use, for the agents and records
 * a test makes.
 */
final class TestProjects
{
    public static function local(): Project
    {
        return Project::createForLocal('Journal');
    }

    /**
     * The local project as the owner of a record a test makes.
     */
    public static function localOwner(): ProjectOwner
    {
        return ProjectOwner::ofProject(self::local()->id);
    }

    /**
     * The project a record made by this actor belongs to: an agent's own, the local project for anyone else.
     */
    public static function ownerOf(Actor $actor): ProjectOwner
    {
        if ($actor instanceof ProjectOwned) {
            return $actor->projectOwner();
        }

        return self::localOwner();
    }
}
