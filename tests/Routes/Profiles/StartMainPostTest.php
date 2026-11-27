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
    protected function arrange(TestJournal $journal): RouteCall
    {
        $agent = $journal->owner()->idleAgent('Main', 'main-agent')->agentCalled('Main');
        $requestId = strtolower((string) Str::ulid());
        $accountId = strtolower((string) Str::ulid());
        $receipt = new StartReceipt(
            $requestId,
            strtolower((string) Str::ulid()),
            $agent->id,
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

        return RouteCall::recorded('session-start', [
            'recorded-session-start' => $requestId,
            '01JPAGEREQUESTAGENT0000000' => $agent->id,
            '01JPAGEREQUESTACCOUNT00000' => $accountId,
        ])
            ->reply(StartProfileMainCommand::class, $receipt)
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
}
