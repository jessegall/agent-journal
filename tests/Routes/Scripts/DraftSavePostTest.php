<?php

declare(strict_types=1);

namespace Tests\Routes\Scripts;

use App\Commands\Profiles\SaveProfileDraft\SaveProfileDraftCommand;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user saves a profile's script draft at the revision they read.
 */
#[TestsRoute('POST', 'scripts.draft.save')]
final class DraftSavePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User)
            ->payload([
                'request_key' => 'save-draft-1',
                'profile' => 'draft-test',
                'expectedRevision' => 0,
                'source' => 'start',
            ])
            ->reply(SaveProfileDraftCommand::class, 1)
            ->expects(SaveProfileDraftCommand::class, [
                'profile' => ProfileKey::from('draft-test'),
                'expectedRevision' => 0,
                'source' => new ScriptSource('start'),
            ]);
    }
}
