<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\ChangeSupervisor\ChangeSupervisorCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Models\Asks\SupervisorChange;
use App\Models\Asks\SupervisorLink;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\ProfileProposal;
use App\Values\AskTypeKey;
use App\Values\ProfileActivation;
use App\Values\SupervisorTarget;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

#[TestsCommand(ChangeSupervisorCommand::class)]
final class ChangeSupervisorTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_changing_a_route_keeps_other_versions_and_records_the_author(): void
    {
        $this->activate((array) config('profiles'));
        $agent = $this->journal->idleAgent('Worker', 'journal-worker')->agentCalled('Worker');
        $actor = ActorIdentity::of(ActorContext::forAgent($agent->id));
        $question = AskTypeKey::of('question');
        $receipt = $this->app->make(CommandBus::class)->run(
            new ChangeSupervisorCommand($actor, SupervisorTarget::parse('profile:journal-main'), 0, $question),
        );
        $link = SupervisorLink::query()->ownedBy($actor)->firstOrFail();

        $this->assertSame(1, $receipt->version);
        $this->assertSame(1, $link->versionFor($question));
        $this->assertSame(0, $link->versionFor(AskTypeKey::of('stuck')));
        $this->assertSame('profile:journal-code-reviewer', $link->routes->default->key);
        $this->assertSame(1, SupervisorChange::query()->count());
    }

    /**
     * @param  array<string, mixed>  $configuration
     */
    private function activate(array $configuration): ProfileActivation
    {
        $this->journal->actAsUserId(TestIds::of(1));

        return $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(
            ProfileProposal::fromConfiguration(['revision' => 1, ...$configuration]),
        ));
    }
}
