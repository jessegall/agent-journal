<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Actions\RecordConversationVisit;
use App\Agents\Actions\StartSessions;
use App\Agents\Contracts\SessionResolver;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\ProgramSourceType;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\ProfileDefaults;
use App\Agents\Support\SelectedProgram;
use App\Agents\Support\StartReceipt;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * An agent's own session list says which program and model each session runs, how they were chosen, that the actual
 * model is not reported, and which native conversation it is in with how many visits.
 */
final class SessionSelectionReadTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $agent = Agent::named('Researcher', 'read-only-helper');
        $selection = SelectedProgram::resolve(
            null,
            ModelSelection::fromInput('default'),
            new ProfileDefaults('journal-researcher', 4, HookProgram::ClaudeCode, false, 'claude-sonnet-5-5', []),
            null,
        );
        $this->session = $this->app->make(StartSessions::class)->start(
            $agent,
            $selection,
            TestSelections::requestId(),
        )->session;
        $this->startRequestAs($agent->id, $this->session->id);
    }

    public function test_the_session_list_shows_the_requested_default_and_the_resolved_model(): void
    {
        $option = $this->app->make(SessionResolver::class)->active()[0];

        $this->assertSame(
            [HookProgram::ClaudeCode, 'claude-sonnet-5-5', ModelSelectionType::ProfileDefault, null],
            [
                $option->selection->program,
                $option->selection->model,
                $option->selection->requested->type,
                $option->selection->requested->model,
            ],
        );
        $this->assertSame(
            [ProgramSourceType::Profile, 'journal-researcher', 4],
            [
                $option->selection->source->programSource,
                $option->selection->source->profileKey,
                $option->selection->source->profileRevision,
            ],
        );
        $this->assertSame(StartReceipt::ACTUAL_MODEL_NOT_REPORTED, $option->actualModel);
        $this->assertSame([null, 0], [$option->conversationNativeId, $option->visitCount]);
    }

    public function test_the_visit_count_after_a_b_a_is_three(): void
    {
        $visits = $this->app->make(RecordConversationVisit::class);
        $visits->entered($this->session->id, 'native-a', 'call-1', CarbonImmutable::now());
        $visits->entered($this->session->id, 'native-b', 'call-2', CarbonImmutable::now());
        $visits->entered($this->session->id, 'native-a', 'call-3', CarbonImmutable::now());

        $option = $this->app->make(SessionResolver::class)->active()[0];

        $this->assertSame(['native-a', 3], [$option->conversationNativeId, $option->visitCount]);
    }
}
