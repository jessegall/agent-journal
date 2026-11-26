<?php

declare(strict_types=1);

namespace Tests\Unit\Assignments;

use App\Contracts\Assignments\AssignmentProviders;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\SystemActor;
use Tests\TestCase;

/**
 * Whether an actor may take work automatically now: an agent while it is not retired and one of its sessions runs,
 * a user whenever the journal admits them, and the engine never.
 */
final class AutoAssignmentActivityTest extends TestCase
{
    public function test_the_engine_has_no_activity(): void
    {
        $this->expectException(AssignmentTypeUnavailable::class);

        $this->app->make(AssignmentProviders::class)->activity(SystemActor::storedType());
    }
}
