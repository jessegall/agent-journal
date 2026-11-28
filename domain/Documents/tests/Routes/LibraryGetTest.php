<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use App\Web\Creation\PageFactory;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Http\Pages\LibraryPageBuilder;
use Domain\Documents\Http\Pages\LibraryPageData;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the library of documents and reports.
 */
#[TestsRoute('GET', 'documents.library')]
final class LibraryGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    public function test_the_library_builder_validates_the_cursor_from_the_isolated_visit(): void
    {
        $factory = new PageFactory($this->app);
        $factory->register(LibraryPageData::class, LibraryPageBuilder::class);
        $this->expectException(ValidationException::class);

        $factory->create(LibraryPageData::class, Request::create('/documents?type=report&after=invalid'));
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
