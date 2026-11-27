<?php

declare(strict_types=1);

namespace Tests\Reads\Accounts;

use App\Accounts\Data\EligibleAccountsData;
use App\Accounts\Data\StartAccountsInput;
use App\Agents\Drivers\DefaultDrivers;
use App\Exceptions\StackTargetRefused;
use App\Http\Loaders\Accounts\StartAccountsLoader;
use Illuminate\Validation\ValidationException;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The accounts a start form offers for an agent on a driver family, read for the owner; an agent the viewer cannot see
 * is refused, and the family keeps its bound.
 */
#[TestsRead(StartAccountsLoader::class)]
final class StartAccountsLoaderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_accounts_of_the_chosen_family_are_the_answer(): void
    {
        $this->journal->owner()
            ->installProfiles()
            ->chooseActiveAccount(DefaultDrivers::CLAUDE_CODE, 'Work')
            ->chooseActiveAccount(DefaultDrivers::CODEX, 'Other')
            ->idleAgent('Writer');

        $answer = $this->read(['agent' => $this->journal->agentCalled('Writer')->id, 'family' => DefaultDrivers::CLAUDE_CODE]);

        $this->journal->assertResult(
            [DefaultDrivers::CLAUDE_CODE, ['Work'], [true]],
            [$answer->driver, array_column($answer->toArray()['accounts'], 'label'), array_column($answer->toArray()['accounts'], 'isDefault')],
        );
    }

    public function test_an_agent_the_viewer_cannot_see_is_refused(): void
    {
        $this->journal->owner();

        $this->expectException(StackTargetRefused::class);

        $this->read(['agent' => '01m8dd0sct689m9bbtqr335rad', 'family' => DefaultDrivers::CLAUDE_CODE]);
    }

    public function test_a_family_past_its_bound_is_refused(): void
    {
        $this->expectException(ValidationException::class);

        StartAccountsInput::validateAndCreate(['agent' => '01m8dd0sct689m9bbtqr335rad', 'family' => str_repeat('f', 33)]);
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function read(array $input): EligibleAccountsData
    {
        return $this->app->make(StartAccountsLoader::class)(StartAccountsInput::validateAndCreate($input));
    }
}
