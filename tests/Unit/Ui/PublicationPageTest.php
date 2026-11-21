<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Ui\Enums\LayoutTag;
use App\Ui\Layout\LayoutBodyData;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\PublicationPage;
use App\Ui\Layout\PublicationTab;
use Tests\Fixtures\UiDeclarations\RecentNotesData;
use Tests\TestCase;

/**
 * The shared publication recipe reads only the tab a window chose, and the body once when there are no tabs.
 */
final class PublicationPageTest extends TestCase
{
    /**
     * @var array<string, int>
     */
    private array $reads = ['text' => 0, 'references' => 0];

    public function test_a_page_opened_on_references_reads_no_text(): void
    {
        $root = $this->page()->layout('references')->root;
        $tabs = $root->children[1];

        $this->assertSame(['text' => 0, 'references' => 1], $this->reads);
        $this->assertSame(LayoutTag::Tabs, $tabs->tag);
        $this->assertSame([false, true], array_map(fn ($tab) => $tab->isChosen, $tabs->tabs));
        $this->assertSame('references', $tabs->children[0]->key);
    }

    public function test_a_choice_the_page_does_not_have_shows_its_first_tab(): void
    {
        $tabs = $this->page()->layout('nothing-like-it')->root->children[1];

        $this->assertSame(['text' => 1, 'references' => 0], $this->reads);
        $this->assertTrue($tabs->tabs[0]->isChosen);
    }

    public function test_a_page_with_no_tabs_shows_its_trusted_body_once(): void
    {
        $page = PublicationPage::make('Entry 7', [], 'Its summary', $this->body(...), []);

        $body = $page->layout('')->root->children[1];

        $this->assertSame(1, $this->reads['text']);
        $this->assertSame(LayoutTag::Body, $body->tag);
        $this->assertInstanceOf(LayoutBodyData::class, $body->body);
        $this->assertStringContainsString('<strong>bold</strong>', $body->body->html);
        $this->assertStringNotContainsString('<script>', $body->body->html);
    }

    public function test_a_native_part_carries_its_component_and_typed_props(): void
    {
        $part = LayoutPartData::native('comments', LayoutNativeData::of('documents/Comments', new RecentNotesData(['a'])));

        $this->assertSame(1, $part->assertWithinCatalogue());
        $this->assertInstanceOf(LayoutNativeData::class, $part->native);
        $this->assertSame('documents/Comments', $part->native->component);
        $this->assertSame(['titles' => ['a']], $part->native->props);
    }

    private function page(): PublicationPage
    {
        return PublicationPage::make('Entry 7', [LayoutPartData::text('edition', 'Second edition', 'muted')], 'Its summary', $this->body(...), [
            PublicationTab::deferred('text', 'Text', fn () => LayoutPartData::body('text', $this->body())),
            PublicationTab::deferred('references', 'References', function (): LayoutPartData {
                $this->reads['references']++;

                return LayoutPartData::notice('references', 'empty', 'No references.');
            }),
        ]);
    }

    private function body(): LayoutBodyData
    {
        $this->reads['text']++;

        return LayoutBodyData::fromMarkdown("Some **bold** text.\n\n<script>alert(1)</script>");
    }
}
