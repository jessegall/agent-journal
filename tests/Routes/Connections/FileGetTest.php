<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Connections\Data\FileWindowData;
use App\Http\Pages\FilePageBuilder;
use App\Web\Creation\PageFactory;
use Illuminate\Http\Request;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the file window; a user the page is hidden from is refused.
 */
#[TestsRoute('GET', 'connections.file')]
final class FileGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_file_builder_reads_the_path_from_its_admitted_visit(): void
    {
        $this->journal->owner();
        $factory = new PageFactory($this->app);
        $factory->register(FileWindowData::class, FilePageBuilder::class);
        $visit = Request::create('/connections/file?path=notes%2Fentry.md');

        $file = $factory->create(FileWindowData::class, $visit);

        $this->assertSame('notes/entry.md', $file->path);
        $this->assertSame('entry.md', $file->name);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::as(Caller::User)
            ->hiddenFrom('Member');
    }
}
