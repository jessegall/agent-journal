<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Handbook\Http\Pages;

use App\Connections\Layout\LayoutBodyData;
use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\PageBuilder;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationPage;
use App\Support\Layout\PublicationTab;
use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Tests\Fixtures\Modules\Handbook\Http\Requests\EntryRequest;
use Tests\Fixtures\Modules\Handbook\Support\HandbookEntries;
use Tests\Fixtures\Modules\Handbook\Values\HandbookEntry;

/**
 * A handbook entry as a publication: its title, edition and summary from the header read, then the chosen tab read
 * alone. Text renders a bounded slice of the entry's text safely, the same reader the page shows without tabs; and
 * References, while the entry shares them, shows one page of them from the window's cursor, with no text read.
 */
final readonly class EntryPageBuilder implements PageBuilder
{
    private const int TEXT_BYTE_LIMIT = 16384;

    private const int REFERENCE_PAGE_SIZE = 50;

    public function __construct(
        private PageFormRequests $requests,
        private HandbookEntries $entries,
        private Guard $auth,
    ) {}

    public function build(Request $visit): EntryPageData
    {
        $request = $this->requests->from(EntryRequest::class, $visit);
        $ownerId = (string) $this->auth->id();
        $entry = $this->entries->visibleTo($ownerId, $request->entryNumber());
        $text = fn () => LayoutBodyData::fromMarkdown($this->entries->textSlice($entry, self::TEXT_BYTE_LIMIT));

        $layout = PublicationPage::build()
            ->title($entry->title)
            ->metadata(
                [LayoutPartData::build()->asText()->key('edition')->value($entry->edition)->style('muted')->finish()],
            )
            ->summary($entry->summary)
            ->body($text)
            ->tabs($this->tabsOf($entry, $request, $text))
            ->finish()->layout($request->chosenTab());

        return EntryPageData::build()->shown($layout)->finish();
    }

    /**
     * @param  Closure(): LayoutBodyData  $text
     * @return list<PublicationTab>
     */
    private function tabsOf(HandbookEntry $entry, EntryRequest $request, Closure $text): array
    {
        if (! $entry->hasTabs) {
            return [];
        }

        $tabs = [PublicationTab::deferred('text', 'Text', fn () => LayoutPartData::build()
            ->asBody()
            ->key('text')
            ->body($text())
            ->finish())];

        if ($entry->sharesReferences) {
            $tabs[] = PublicationTab::deferred('references', 'References', fn () => $this->referencesOf($entry, $request));
        }

        return $tabs;
    }

    /**
     * One page of the entry's references from the window's cursor, each linking to its own entry, and a link to the
     * next page while there is one; a notice when there are none.
     */
    private function referencesOf(HandbookEntry $entry, EntryRequest $request): LayoutPartData
    {
        $cursor = $request->cursor();
        $page = $this->entries->referencePage($entry, $cursor, self::REFERENCE_PAGE_SIZE);

        if ($page === [] && $cursor === 0) {
            return LayoutPartData::build()
                ->asNotice()
                ->key('references')
                ->style('info')
                ->title('No references.')
                ->finish();
        }

        $parts = [LayoutPartData::build()
            ->asCollection()
            ->key('references')
            ->style('list')
            ->rows(
                array_map(
                    fn (HandbookEntry $reference) => LayoutRowData::build()
                        ->key((string) $reference->number)
                        ->label($reference->title)
                        ->value($reference->edition)
                        ->href("/handbook/entries/{$reference->number}")
                        ->finish(),
                    $page,
                ),
            )
            ->finish()];

        $next = $cursor + self::REFERENCE_PAGE_SIZE;

        if ($next < $this->entries->referenceCount($entry)) {
            $nextPage = LayoutActionData::build()->query(['cursor' => (string) $next])->finish();
            $parts[] = LayoutPartData::build()
                ->asAction()
                ->key('next')
                ->label('Next page')
                ->action($nextPage)
                ->finish();
        }

        return LayoutPartData::build()
            ->asBox()
            ->key('references-page')
            ->style('stack')
            ->children(...$parts)
            ->finish();
    }
}
