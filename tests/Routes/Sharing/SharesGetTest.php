<?php

declare(strict_types=1);

namespace Tests\Routes\Sharing;

use App\Http\Pages\Sharing\ShareListPageBuilder;
use App\Http\Pages\Sharing\ShareListPageData;
use App\Web\Creation\PageFactory;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the list of shares.
 */
#[TestsRoute('GET', 'sharing.shares')]
final class SharesGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_share_list_builder_validates_its_own_cursor(): void
    {
        $factory = new PageFactory($this->app);
        $factory->register(ShareListPageData::class, ShareListPageBuilder::class);
        $this->expectException(ValidationException::class);

        $factory->create(ShareListPageData::class, Request::create('/sharing?after=invalid'));
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
