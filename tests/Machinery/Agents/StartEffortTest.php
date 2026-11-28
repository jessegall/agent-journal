<?php

declare(strict_types=1);

namespace Tests\Machinery\Agents;

use App\Agents\Drivers\DefaultDrivers;
use App\Resolvers\ProfileSelections;
use App\Sessions\Contracts\ProfileSelections as ProfileSelectionsContract;
use App\Values\ModelSelection;
use App\Values\ProfileKey;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A start runs at the effort the start picker chose, and at the effort of the profile's tier when it chose none.
 */
#[TestsMachinery(ProfileSelections::class)]
final class StartEffortTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_start_runs_at_the_effort_chosen_and_at_the_profiles_effort_with_none(): void
    {
        $this->journal->owner()->installProfiles();
        $selections = $this->app->make(ProfileSelectionsContract::class);
        $profile = ProfileKey::from('main-agent');
        $model = ModelSelection::fromInput('default');

        $chosen = $selections->select($profile, $model, DefaultDrivers::CLAUDE_CODE, 'low')->selection;
        $unchosen = $selections->select($profile, $model, DefaultDrivers::CLAUDE_CODE, null)->selection;

        $this->assertSame('low', $chosen->effort);
        $this->assertContains($unchosen->effort, ['low', 'medium', 'high']);
    }
}
