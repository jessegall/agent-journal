<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\SessionResolver;
use App\Enums\Drivers\DriverSourceType;
use App\Enums\Drivers\DriverType;
use App\Enums\Profiles\ModelTier;
use App\Enums\Starts\ModelSelectionType;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Support\DefaultDrivers;
use App\Support\RecordConversationVisit;
use App\Support\StartReceipt;
use App\Support\StartSessions;
use App\Values\ModelSelection;
use App\Values\ProfileDefaults;
use App\Values\SelectedDriver;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * An agent's own session list says which driver and model each session runs, how they were chosen, that the actual
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

        $agent = Agent::create('Researcher', 'read-only-helper');
        $selection = SelectedDriver::resolve(
            null,
            ModelSelection::fromInput('default'),
            new ProfileDefaults('journal-researcher', 4, DefaultDrivers::CLAUDE_CODE, ModelTier::General, DriverType::Headless),
            null,
            $this->app->make(DriverCatalogue::class),
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
            [DefaultDrivers::CLAUDE_CODE, 'claude-sonnet-5-5', ModelSelectionType::ProfileDefault, null],
            [
                $option->selection->driver,
                $option->selection->model,
                $option->selection->requested->type,
                $option->selection->requested->model,
            ],
        );
        $this->assertSame(
            [DriverSourceType::Profile, 'journal-researcher', 4],
            [
                $option->selection->source->driverSource,
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
        $visits->entered($this->session->id, 'native-a', null, 'call-1', CarbonImmutable::now());
        $visits->entered($this->session->id, 'native-b', null, 'call-2', CarbonImmutable::now());
        $visits->entered($this->session->id, 'native-a', null, 'call-3', CarbonImmutable::now());

        $option = $this->app->make(SessionResolver::class)->active()[0];

        $this->assertSame(['native-a', 3], [$option->conversationNativeId, $option->visitCount]);
    }
}
