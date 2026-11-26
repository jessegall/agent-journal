<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverSourceType;
use App\Support\DefaultDrivers;
use App\Support\StartReceipt;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\SelectionSource;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner starts a session of an agent with the profile's default driver and model.
 */
#[TestsRoute('POST', 'agents.start')]
final class StartPostTest extends GuardedRouteEntryTestCase
{
    public function test_a_missing_program_or_model_or_the_default_model_is_refused_and_nothing_is_sent(): void
    {
        $agent = $this->journal->owner()->signedStart('Main')->agent;
        $this->journal->sinkCommands();

        foreach ([['model' => 'gpt-6-luna'], ['driver' => 'codex'], ['driver' => 'codex', 'model' => 'default']] as $input) {
            $status = $this->journal->jsonRoute('POST', 'agents.start', ['agent' => $agent->id], payload: [
                'requestId' => strtolower((string) Str::ulid()),
                ...$input,
            ])->status();

            $this->assertGreaterThanOrEqual(400, $status, json_encode($input, JSON_THROW_ON_ERROR));
        }

        $this->journal->assertNothingDispatched();
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');

        return RouteCall::as(Caller::User)
            ->parameters([
                'agent' => $start->agent->id,
            ])
            ->payload([
                'requestId' => strtolower((string) Str::ulid()),
                'model' => 'claude-opus-5-5',
                'driver' => DefaultDrivers::CLAUDE_CODE,
            ])
            ->reply(StartAgentCommand::class, new StartReceipt(
                strtolower((string) Str::ulid()),
                $start->session->id,
                $start->agent->id,
                new SelectedDriver(
                    DefaultDrivers::CLAUDE_CODE,
                    'claude-opus-5-5',
                    ModelSelection::named('claude-opus-5-5'),
                    new SelectionSource(DriverSourceType::Profile, 'main-agent', 1),
                ),
                false,
                ConversationModeType::Resume,
                'claude-opus-5-5',
                [],
            ))
            ->expects(StartAgentCommand::class);
    }
}
