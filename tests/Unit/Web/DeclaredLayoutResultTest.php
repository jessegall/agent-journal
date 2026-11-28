<?php

declare(strict_types=1);

namespace Tests\Unit\Web;

use App\Actors\ActorStore;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\RecordLayoutData;
use App\Support\RecordIdentity;
use App\Support\WindowResultBuilder;
use App\Navigation\Declarations\DomainClient;
use App\Web\Creation\SurfaceDefinition;
use Closure;
use Spatie\LaravelData\Data;
use Tests\Fixtures\ClientDeclarations\Shelf\Http\Pages\ShelfLayoutPageBuilder;
use Tests\Fixtures\ClientDeclarations\Shelf\Http\Pages\ShelfLayoutPageData;
use Tests\Fixtures\Web\Types\BookRecordPage;
use Tests\TestCase;

/**
 * A declared layout reaches the browser as its parts alone, with no dock offer.
 */
final class DeclaredLayoutResultTest extends TestCase
{
    public function test_a_record_projection_exposes_the_layout_and_keeps_its_identity_on_the_server(): void
    {
        $layout = DeclaredLayoutData::build()
            ->root(LayoutPartData::build()->asText()->key('title')->value('Book')->finish())
            ->finish();
        $record = RecordIdentity::from(['type' => 'library.book', 'id' => '01j00000000000000000000001']);
        $shown = RecordLayoutData::build()->shown($layout)->record($record)->finish();
        $product = BookRecordPage::from(['shown' => $shown]);

        $this->assertSame($layout, $product->layout());
        $this->assertSame($record, $product->shownRecord()->get());
        $this->assertSame([], $product->toArray());
    }

    public function test_a_layout_that_does_not_dock_asks_for_no_offer(): void
    {
        $result = $this->resultOf(fn () => DeclaredLayoutData::build()
            ->root(LayoutPartData::build()->asText()->key('title')->value('Shelf')->finish())
            ->finish());

        $this->assertArrayNotHasKey('offer', $result->toArray());
    }

    /**
     * @param  Closure(): DeclaredLayoutData  $read
     */
    private function resultOf(Closure $read): Data
    {
        return $this->app->make(ActorStore::class)->actAsSystem(
            'test',
            fn (): Data => $this->app->make(WindowResultBuilder::class)->surface(
                'shelf.lent',
                'window shelf.lent',
                [],
                $this->definition(),
                fn () => ShelfLayoutPageData::build()->shown($read())->finish(),
            ),
        );
    }

    private function definition(): SurfaceDefinition
    {
        return new SurfaceDefinition(
            ShelfLayoutPageData::class,
            ShelfLayoutPageBuilder::class,
            DomainClient::DECLARED_LAYOUT,
        );
    }
}
