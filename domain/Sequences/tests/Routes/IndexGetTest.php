<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Routes;

use App\Web\Creation\PageFactory;
use Domain\Sequences\Http\Pages\SequenceIndexPageBuilder;
use Domain\Sequences\Http\Pages\SequenceIndexPageData;
use Domain\Sequences\SequencesDomain;
use Illuminate\Http\Request;
use Inertia\Testing\AssertableInertia;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the list of sequences.
 */
#[TestsRoute('GET', 'sequences.index')]
final class IndexGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_sequence_index_builds_its_declared_layout_type(): void
    {
        $this->journal->owner();
        $factory = new PageFactory($this->app);
        $factory->register(SequenceIndexPageData::class, SequenceIndexPageBuilder::class);
        $index = $factory->create(SequenceIndexPageData::class, Request::create('/sequences'));

        $this->assertSame('Sequences', $index->layout()->root->children[0]->children[0]->text);
    }

    public function test_the_full_index_exposes_the_projected_layout(): void
    {
        $journal = $this->journal->owner();

        $this->actingAs($journal->ownerUser())->get(route('sequences.index'))->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('layout/DeclaredLayout')
                ->where('page.status', 'ready')
                ->where('page.data.root.children.0.children.0.text', 'Sequences')
                ->missing('page.data.shown'),
        );
    }

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SequencesDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
