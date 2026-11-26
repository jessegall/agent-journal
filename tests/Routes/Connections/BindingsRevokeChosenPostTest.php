<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Projects\Commands\RevokeProjectBindings\RevokeProjectBindingsCommand;
use App\Projects\Values\BindingOutcome;
use App\Projects\Values\RevokedBindings;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner disconnects the folders they chose at once.
 */
#[TestsRoute('POST', 'connections.bindings.revoke-chosen')]
final class BindingsRevokeChosenPostTest extends GuardedRouteEntryTestCase
{
    public function test_the_page_is_told_each_bindings_outcome(): void
    {
        $call = $this->arrangedCall();
        $this->journal->sinkCommands()->sinkReplies($call->replies);
        $bindingId = $call->payload['bindings'][0];

        $this->send($call, $call->caller)
            ->assertRedirect()
            ->assertSessionHas('inertia.flash_data', ['revokedBindings' => [$bindingId => 'Revoked']]);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $bindingId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->payload([
                'bindings' => [
                    $bindingId,
                ],
            ])
            ->reply(RevokeProjectBindingsCommand::class, new RevokedBindings([
                new BindingOutcome($bindingId, 'Revoked', '2026-11-26T10:00:00+00:00'),
            ]))
            ->expects(RevokeProjectBindingsCommand::class, [
                'ids' => [
                    $bindingId,
                ],
            ]);
    }
}
