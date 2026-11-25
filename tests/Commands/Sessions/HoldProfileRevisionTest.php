<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Sessions\HoldProfileRevision\HoldProfileRevisionCommand;
use App\Models\Profiles\ProfileRevisionHold;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A revoked profile revision is held, so the sessions still running on it are stopped and reconciled later.
 */
final class HoldProfileRevisionTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_revision_is_held_until_it_is_reconciled(): void
    {
        $this->journal->owner();

        $holdId = $this->journal->run(new HoldProfileRevisionCommand('main-agent', 2));

        $hold = ProfileRevisionHold::query()->findOrFail($holdId);
        $this->assertSame(['main-agent', 2, null], [$hold->profile_key, $hold->profile_revision, $hold->reconciled_at]);
    }
}
