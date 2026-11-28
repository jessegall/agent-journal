<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Agents\Commands\CreateMainAgent\CreateMainAgentCommand;
use App\Agents\Drivers\DefaultDrivers;
use App\Http\Controllers\Agents\CreateMainAgentController;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStartChoice;
use App\Support\ActorReference;
use App\Values\ProfileBase;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner opens a new chat: another main agent, made with the driver and model its first message starts it on.
 */
#[TestsRoute('POST', 'agents.create-main')]
final class CreateMainPostTest extends GuardedRouteEntryTestCase
{
    public function test_two_new_chats_make_two_main_agents_each_keeping_its_choice_for_its_first_start(): void
    {
        $this->journal->owner()->idleAgent('Main', 'main-agent');

        foreach (['claude-opus-5-5', 'claude-sonnet-5-5'] as $model) {
            $this->journal->route('POST', 'agents.create-main', payload: [
                'requestId' => strtolower((string) Str::ulid()),
                'driver' => DefaultDrivers::CLAUDE_CODE,
                'model' => $model,
            ])->assertRedirect()->assertInertiaFlash(CreateMainAgentController::CREATED_AGENT);
        }

        $made = Agent::query()->where('profile_key', ProfileBase::mainAgent()->key)->where('name', 'like', 'Agent %')
            ->orderBy('name')->get();

        $this->assertSame(['Agent 2', 'Agent 3'], $made->pluck('name')->all());
        $this->assertSame(
            ['claude-opus-5-5', 'claude-sonnet-5-5'],
            $made->map(fn (Agent $agent) => AgentStartChoice::findFor($agent->id)?->model)->all(),
        );
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $created = ActorReference::ofClass(Agent::class, strtolower((string) Str::ulid()));

        return RouteCall::as(Caller::User)
            ->payload([
                'requestId' => strtolower((string) Str::ulid()),
                'driver' => DefaultDrivers::CLAUDE_CODE,
                'model' => 'default',
            ])
            ->reply(CreateMainAgentCommand::class, $created)
            ->expects(CreateMainAgentCommand::class, [
                'projectId' => TestProjects::local()->id,
                'driver' => DefaultDrivers::CLAUDE_CODE,
                'model' => 'default',
                'account' => null,
            ]);
    }
}
