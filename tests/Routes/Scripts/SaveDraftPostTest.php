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
 * The owner saves the editor's script at the revision the page holds; a user the page is hidden from is refused.
 */
#[TestsRoute('POST', 'scripts.save-draft')]
final class SaveDraftPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::as(Caller::User)
            ->parameters([
                'profile' => 'draft-test',
            ])
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
            ])
            ->hiddenFrom('Member');
    }
}
