<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Actors\Support\ActorStore;
use App\Http\Requests\Web\DeclaredPageRequest;
use App\Http\Support\Web\PageProps;
use App\Ui\Declarations\RegisteredPage;
use App\Ui\Support\UiDeclarations;
use App\Web\Data\UnavailableWindow;
use Tests\Support\ActsAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A record that is missing or outside the user's scope answers the same: 404 at its own address, and unavailable in
 * the inspector, so neither says which it is.
 */
final class UnavailableRecordTest extends TestCase
{
    use ActsAsOwner;
    use RefreshHookDatabase;

    public function test_a_missing_report_answers_404_at_its_own_address(): void
    {
        $this->actingAs($this->owner)->get('/documents/reports/99999')->assertNotFound();
    }

    public function test_a_missing_document_in_the_inspector_reads_as_unavailable(): void
    {
        $this->actingAs($this->owner);
        $props = $this->app->make(PageProps::class)->forPage(
            $this->app->make(UiDeclarations::class)->page(RegisteredPage::HOME),
            DeclaredPageRequest::create('/?inspect=documents.document&document=99999'),
        );

        $inspector = $this->app->make(ActorStore::class)->actAsSystem('test', fn () => ($props['inspector'])());

        $this->assertInstanceOf(UnavailableWindow::class, $inspector);
        $this->assertSame(['state' => 'unavailable'], $inspector->toArray());
    }
}
