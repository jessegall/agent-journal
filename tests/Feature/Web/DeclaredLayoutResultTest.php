<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Contracts\Navigation\PageResolver;
use App\Declarations\ResolverDefinition;
use App\Support\ActorStore;
use App\Support\DomainEntry;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use App\Support\WindowResults;
use Closure;
use Spatie\LaravelData\Data;
use Tests\Fixtures\ClientDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\ClientDeclarations\ShelfLayoutResolver;
use Tests\TestCase;

/**
 * A declared layout reaches the browser as its parts alone, with no dock offer.
 */
final class DeclaredLayoutResultTest extends TestCase
{
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
