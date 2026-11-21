<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Agents\Enums\DriverSourceType;
use App\Agents\Exceptions\DriverConflict;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StartReceipt;
use App\Agents\Values\ModelSelection;
use App\Bus\Contracts\CommandBus;
use App\Drivers\Enums\HookDriver;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Commands\StartProfileMain;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Exceptions\ProfileCannotCoordinate;
use App\Profiles\Support\PolicyOverride;
use App\Profiles\Support\ProposedProfile;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A main start from a profile: its default model and revision become the start's selection, a pinned program
 * refuses another, a helper profile cannot start a main, and a later activation leaves an accepted start as it was.
 */
final class ProfileStartTest extends TestCase
{
    use HasContainerSupport;
    use RefreshHookDatabase;
    use StartsAgentRequests;
    use WithActiveAccount;

    private Agent $main;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $this->main = Agent::create('Main', 'main-agent');
    }

    public function test_default_resolves_to_the_profiles_model_and_revision(): void
    {
        $this->activate(self::main('opus', HookDriver::ClaudeCode, false));
        $revision = $this->currentRevision();

        $receipt = $this->start('default', null);

        $this->assertSame('opus', $receipt->selection->model);
        $this->assertSame(HookDriver::ClaudeCode, $receipt->selection->driver);
        $source = $receipt->selection->source;
        $this->assertSame(DriverSourceType::Profile, $source->driverSource);
        $this->assertSame('journal-main', $source->profileKey);
        $this->assertSame($revision, $source->profileRevision);
    }

    public function test_a_pinned_program_refuses_another(): void
    {
        $this->activate(self::main('opus', HookDriver::ClaudeCode, true));

        $this->expectException(DriverConflict::class);

        $this->start('default', 'codex');
    }

    public function test_a_helper_profile_cannot_start_a_main(): void
    {
        $this->activate(TestProposals::profile('journal-main', ProfileBase::readOnlyHelper()));

        $this->expectException(ProfileCannotCoordinate::class);

        $this->start('default', null);
    }

    public function test_a_later_activation_leaves_an_accepted_start_as_it_was(): void
    {
        $this->activate(self::main('opus', HookDriver::ClaudeCode, false));
        $revision = $this->currentRevision();
        $receipt = $this->start('default', null);

        $this->activate(self::main('sonnet', HookDriver::Codex, true));

        $session = AgentSession::query()->findOrFail($receipt->sessionId);

        $this->assertSame($revision, $session->profile_revision);
        $this->assertSame('opus', $session->model);
        $this->assertSame(HookDriver::ClaudeCode->value, $session->driver);
    }

    private static function main(string $model, HookDriver $driver, bool $pinned): ProposedProfile
    {
        return new ProposedProfile(
            ProfileKey::from('journal-main'),
            'Main',
            ProfileBase::mainAgent(),
            'Lead the work.',
            $model,
            $driver,
            $pinned,
            ['opus', 'sonnet'],
            null,
            [],
            null,
            PolicyOverride::none(),
            [],
        );
    }

    /**
     * The revision the main profile is at now; rows another test committed may have numbered it past one.
     */
    private function currentRevision(): int
    {
        return $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('journal-main'))->revision;
    }

    private function activate(ProposedProfile $profile): void
    {
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(TestProposals::of($profile)));
    }

    private function start(string $model, string|null $driver): StartReceipt
    {
        $start = new StartProfileMain(
            strtolower((string) Str::ulid()),
            $this->main->id,
            ProfileKey::from('journal-main'),
            ModelSelection::fromInput($model),
            $driver,
        );

        return $this->app->make(CommandBus::class)->run($start);
    }
}
