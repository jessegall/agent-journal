<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Agents\Commands\StartProfileMain\StartProfileMainCommand;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverSourceType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Values\SelectionSource;
use App\Sessions\StartReceipt;
use App\Values\ChosenAccount;
use App\Values\ModelSelection;
use App\Values\ProfileKey;
use App\Values\SelectedDriver;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner starts a main agent on the profile with the model, driver and account they chose.
 */
#[TestsRoute('POST', 'profiles.start-main')]
final class StartMainPostTest extends GuardedRouteEntryTestCase
{
    public function test_the_start_picker_starts_the_session_in_its_chat_at_the_effort_chosen(): void
    {
        $agent = $this->journal->owner()->idleAgent('Agent 4', 'main-agent')->agentCalled('Agent 4');
        $requestId = strtolower((string) Str::ulid());
        $accountId = strtolower((string) Str::ulid());
        $this->journal->sinkCommands()->sinkReply(
            StartProfileMainCommand::class,
            self::receiptFor($requestId, $agent->id),
        );

        $this->journal->route('POST', 'profiles.start-main', ['profile' => 'main-agent'], payload: [
            'requestId' => $requestId,
            'agentId' => $agent->id,
            'driver' => DefaultDrivers::CLAUDE_CODE,
            'driverType' => 'terminal',
            'model' => 'opus',
            'effort' => 'high',
            'accountId' => $accountId,
            'accountRevision' => 3,
        ], headers: ['Idempotency-Key' => $requestId])->assertRedirect();

        $this->journal->assertDispatched(StartProfileMainCommand::class, [
            'requestId' => $requestId,
            'agentId' => $agent->id,
            'requested' => ModelSelection::named('opus'),
            'driverKey' => DefaultDrivers::CLAUDE_CODE,
            'chosenAccount' => new ChosenAccount($accountId, 3),
            'effort' => 'high',
        ]);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $agent = $journal->owner()->idleAgent('Main', 'main-agent')->agentCalled('Main');
        $requestId = strtolower((string) Str::ulid());
        $accountId = strtolower((string) Str::ulid());

        return RouteCall::recorded('session-start', [
            'recorded-session-start' => $requestId,
            '01JPAGEREQUESTAGENT0000000' => $agent->id,
            '01JPAGEREQUESTACCOUNT00000' => $accountId,
        ])
            ->reply(StartProfileMainCommand::class, self::receiptFor($requestId, $agent->id))
            ->expects(StartProfileMainCommand::class, [
                'requestId' => $requestId,
                'agentId' => $agent->id,
                'profile' => ProfileKey::from('journal-main'),
                'requested' => ModelSelection::named('opus'),
                'driverKey' => DefaultDrivers::CLAUDE_CODE,
                'chosenAccount' => new ChosenAccount($accountId, 4),
                'previewRevision' => 4,
            ]);
    }

    private static function receiptFor(string $requestId, string $agentId): StartReceipt
    {
        return new StartReceipt(
            $requestId,
            strtolower((string) Str::ulid()),
            $agentId,
            new SelectedDriver(
                DefaultDrivers::CLAUDE_CODE,
                'claude-opus-5-5',
                'medium',
                ModelSelection::named('claude-opus-5-5'),
                new SelectionSource(DriverSourceType::Profile, 'journal-main', 4)
            ),
            true,
            ConversationModeType::New,
            'claude-opus-5-5',
            [],
        );
    }
}
