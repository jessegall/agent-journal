<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Agents\Commands\ContinueStart\ContinueStartCommand;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverSourceType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Values\SelectionSource;
use App\Sessions\StartReceipt;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner continues an agent's session that stopped.
 */
#[TestsRoute('POST', 'agents.continue')]
final class ContinuePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');

        return RouteCall::as(Caller::User)
            ->parameters(['session' => $start->session->id])
            ->payload(['agent_id' => $start->agent->id])
            ->reply(ContinueStartCommand::class, new StartReceipt(
                strtolower((string) Str::ulid()),
                $start->session->id,
                $start->agent->id,
                new SelectedDriver(
                    DefaultDrivers::CLAUDE_CODE,
                    'claude-opus-5-5',
                    'medium',
                    ModelSelection::named('claude-opus-5-5'),
                    new SelectionSource(DriverSourceType::Profile, 'main-agent', 1)
                ),
                false,
                ConversationModeType::Resume,
                'claude-opus-5-5',
                [],
            ))
            ->expects(ContinueStartCommand::class, [
                'sessionId' => $start->session->id,
                'agentId' => $start->agent->id,
            ]);
    }
}
