<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Agents\Enums\ProgramSourceType;
use App\Agents\Exceptions\ProgramConflict;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\LaunchReceipt;
use App\Agents\Support\ModelSelection;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Commands\LaunchProfileMain;
use App\Profiles\Exceptions\ProfileCannotCoordinate;
use App\Profiles\Support\PolicyOverride;
use App\Profiles\Support\ProposedProfile;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use App\Programs\Enums\HookProgram;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A main launch from a profile: its default model and revision become the launch's selection, a pinned program
 * refuses another, a helper profile cannot launch a main, and a later activation leaves an accepted launch as it was.
 */
final class ProfileLaunchTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private Agent $main;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $this->main = Agent::named('Main', 'main-agent');
    }

    public function test_default_resolves_to_the_profiles_model_and_revision(): void
    {
        $this->activate(self::main('opus', HookProgram::ClaudeCode, false));

        $receipt = $this->launch('default', null);

        $this->assertSame('opus', $receipt->selection->model);
        $this->assertSame(HookProgram::ClaudeCode, $receipt->selection->program);
        $this->assertSame(ProgramSourceType::Profile, $receipt->selection->source->programSource);
        $this->assertSame('journal-main', $receipt->selection->source->profileKey);
        $this->assertSame(1, $receipt->selection->source->profileRevision);
    }

    public function test_a_pinned_program_refuses_another(): void
    {
        $this->activate(self::main('opus', HookProgram::ClaudeCode, true));

        $this->expectException(ProgramConflict::class);

        $this->launch('default', 'codex');
    }

    public function test_a_helper_profile_cannot_launch_a_main(): void
    {
        $this->activate(TestProposals::profile('journal-main', ProfileBase::readOnlyHelper()));

        $this->expectException(ProfileCannotCoordinate::class);

        $this->launch('default', null);
    }

    public function test_a_later_activation_leaves_an_accepted_launch_as_it_was(): void
    {
        $this->activate(self::main('opus', HookProgram::ClaudeCode, false));
        $receipt = $this->launch('default', null);

        $this->activate(self::main('sonnet', HookProgram::Codex, true));

        $session = AgentSession::query()->findOrFail($receipt->sessionId);

        $this->assertSame(1, $session->profile_revision);
        $this->assertSame('opus', $session->model);
        $this->assertSame(HookProgram::ClaudeCode->value, $session->program);
    }

    private static function main(string $model, HookProgram $program, bool $pinned): ProposedProfile
    {
        return new ProposedProfile(
            ProfileKey::from('journal-main'),
            'Main',
            ProfileBase::mainAgent(),
            'Lead the work.',
            $model,
            $program,
            $pinned,
            ['opus', 'sonnet'],
            null,
            [],
            null,
            PolicyOverride::none(),
            [],
        );
    }

    private function activate(ProposedProfile $profile): void
    {
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(TestProposals::of($profile)));
    }

    private function launch(string $model, string|null $program): LaunchReceipt
    {
        $launch = new LaunchProfileMain(
            strtolower((string) Str::ulid()),
            $this->main->id,
            ProfileKey::from('journal-main'),
            ModelSelection::fromInput($model),
            $program,
        );

        return $this->app->make(CommandBus::class)->run($launch);
    }
}
