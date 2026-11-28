<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use App\Agents\Drivers\DefaultDrivers;
use App\Exceptions\StackTargetRefused;
use Domain\Chat\Data\StartDriversData;
use Domain\Chat\Data\StartDriversInput;
use Domain\Chat\Http\Loaders\StartDriversLoader;
use Domain\Chat\Tests\TestCase;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;

/**
 * The drivers an agent's start form offers, read on any page that shows the form: a driver no account can run cannot
 * be chosen, and an agent the viewer cannot see is refused.
 */
#[TestsRead(StartDriversLoader::class)]
final class StartDriversLoaderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_driver_with_an_account_can_be_chosen_and_one_without_cannot(): void
    {
        $this->journal->owner()
            ->installProfiles()
            ->chooseActiveAccount(DefaultDrivers::CLAUDE_CODE, 'Work')
            ->idleAgent('Writer');

        $drivers = $this->read($this->journal->agentCalled('Writer')->id)->toArray()['drivers'];
        $reasons = array_column($drivers, 'unavailableReason', 'family');

        $this->journal->assertResult(
            [null, 'No account can run Codex yet: add one under Accounts.'],
            [$reasons[DefaultDrivers::CLAUDE_CODE], $reasons[DefaultDrivers::CODEX]],
        );
    }

    public function test_an_agent_the_viewer_cannot_see_is_refused(): void
    {
        $this->journal->owner();

        $this->expectException(StackTargetRefused::class);

        $this->read('01m8dd0sct689m9bbtqr335rad');
    }

    private function read(string $agent): StartDriversData
    {
        return $this->app->make(StartDriversLoader::class)(StartDriversInput::validateAndCreate(['agent' => $agent]));
    }
}
