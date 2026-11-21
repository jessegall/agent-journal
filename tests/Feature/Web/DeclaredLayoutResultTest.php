<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Actors\Support\ActorStore;
use App\Docking\Cards\DockIdentity;
use App\Docking\Data\DockOfferData;
use App\Docking\Sources\Contracts\DockOffers;
use App\Domains\Support\DomainEntry;
use App\Ui\Contracts\PageResolver;
use App\Ui\Declarations\ResolverDefinition;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutPartData;
use App\Web\Data\ReadyWindow;
use App\Web\Support\WindowResults;
use Closure;
use PhpOption\Option;
use PhpOption\Some;
use Spatie\LaravelData\Data;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\UiDeclarations\ShelfLayoutResolver;
use Tests\TestCase;

/**
 * A declared layout reaches the browser as its parts alone: a layout that docks gets its dock offer, and the source it
 * docks as stays on the server.
 */
final class DeclaredLayoutResultTest extends TestCase
{
    public function test_a_docking_layout_is_offered_its_dock_and_never_sends_its_source(): void
    {
        $offers = new class implements DockOffers
        {
            /** @var list<DockIdentity> */
            public array $asked = [];

            public function offerFor(DockIdentity $source): Option
            {
                $this->asked[] = $source;

                return new Some(new DockOfferData('Dock', 'card', 'offer-1', '/dock', 'destination', []));
            }
        };
        $this->app->instance(DockOffers::class, $offers);
        $layout = DeclaredLayoutData::of(LayoutPartData::text('title', 'Shelf'))
            ->docking(new DockIdentity('shelf', 'secret-source-id'));

        $result = $this->resultOf(fn () => $layout);

        $this->assertInstanceOf(ReadyWindow::class, $result);
        $this->assertSame([['type' => 'shelf', 'id' => 'secret-source-id']], array_map(
            fn (DockIdentity $asked) => ['type' => $asked->type, 'id' => $asked->id],
            $offers->asked,
        ));
        $wire = json_encode($result->toArray(), JSON_THROW_ON_ERROR);
        $this->assertStringNotContainsString('secret-source-id', $wire);
        $this->assertSame(['root'], array_keys($result->toArray()['data']));
        $this->assertSame('offer-1', $result->toArray()['dockOffer']['id']);
    }

    public function test_a_layout_that_does_not_dock_asks_for_no_offer(): void
    {
        $result = $this->resultOf(fn () => DeclaredLayoutData::of(LayoutPartData::text('title', 'Shelf')));

        $this->assertArrayNotHasKey('dockOffer', $result->toArray());
    }

    /**
     * @param  Closure(): DeclaredLayoutData  $read
     */
    private function resultOf(Closure $read): Data
    {
        return $this->app->make(ActorStore::class)->actAsSystem(
            'test',
            fn (): Data => $this->app->make(WindowResults::class)->result('shelf.lent', [], $this->definition(), $read),
        );
    }

    private function definition(): ResolverDefinition
    {
        return ResolverDefinition::of(
            DomainEntry::fromClass(ShelfDomain::class)->declaring(pages: []),
            'shelf.lent',
            ShelfLayoutResolver::class,
            PageResolver::class,
            DeclaredLayoutData::class,
        );
    }
}
