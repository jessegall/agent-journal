<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Actors\Support\ActorStore;
use App\Domains\Support\DomainEntry;
use App\Ui\Contracts\PageResolver;
use App\Ui\Declarations\ResolverDefinition;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutPartData;
use App\Web\Support\WindowResults;
use Closure;
use Spatie\LaravelData\Data;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\UiDeclarations\ShelfLayoutResolver;
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
