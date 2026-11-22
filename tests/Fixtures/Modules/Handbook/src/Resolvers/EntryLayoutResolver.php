<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Handbook\Resolvers;

use App\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBodyData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationPage;
use App\Support\Layout\PublicationTab;
use Closure;
use Illuminate\Contracts\Auth\Guard;
use Tests\Fixtures\Modules\Handbook\Http\Requests\EntryRequest;
use Tests\Fixtures\Modules\Handbook\Support\HandbookEntries;
use Tests\Fixtures\Modules\Handbook\Values\HandbookEntry;

/**
 * A handbook entry as a publication: its title, edition and summary from the header read, then the chosen tab read
 * alone. Text renders a bounded slice of the entry's text safely, the same reader the page shows without tabs; and
 * References, while the entry shares them, shows one page of them from the window's cursor, with no text read.
 */
final readonly class EntryLayoutResolver implements PageResolver
{
    private const int TEXT_BYTE_LIMIT = 16384;

    private const int REFERENCE_PAGE_SIZE = 50;

    public function __construct(
        private EntryRequest $request,
        private HandbookEntries $entries,
        private Guard $auth,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $ownerId = (string) $this->auth->id();
        $entry = $this->entries->visibleTo($ownerId, $this->request->entryNumber());
        $text = fn () => LayoutBodyData::fromMarkdown($this->entries->textSlice($entry, self::TEXT_BYTE_LIMIT));

        return PublicationPage::make(
            $entry->title,
            [LayoutPartData::text('edition', $entry->edition, 'muted')],
            $entry->summary,
            $text,
            $this->tabsOf($entry, $text),
        )->layout($this->request->chosenTab());
    }

    /**
     * @param  Closure(): LayoutBodyData  $text
     * @return list<PublicationTab>
     */
    private function tabsOf(HandbookEntry $entry, Closure $text): array
    {
        if (! $entry->hasTabs) {
            return [];
        }

        $tabs = [PublicationTab::deferred('text', 'Text', fn () => LayoutPartData::body('text', $text()))];

        if ($entry->sharesReferences) {
            $tabs[] = PublicationTab::deferred('references', 'References', fn () => $this->referencesOf($entry));
        }

        return $tabs;
    }

    /**
     * One page of the entry's references from the window's cursor, each linking to its own entry, and a link to the
     * next page while there is one; a notice when there are none.
     */
    private function referencesOf(HandbookEntry $entry): LayoutPartData
    {
        $cursor = $this->request->cursor();
        $page = $this->entries->referencePage($entry, $cursor, self::REFERENCE_PAGE_SIZE);

        if ($page === [] && $cursor === 0) {
            return LayoutPartData::notice('references', 'info', 'No references.');
        }

        $parts = [LayoutPartData::collection('references', 'list', array_map(
            fn (HandbookEntry $reference) => new LayoutRowData(
                (string) $reference->number,
                $reference->title,
                $reference->edition,
                href: "/handbook/entries/{$reference->number}",
            ),
            $page,
        ))];

        $next = $cursor + self::REFERENCE_PAGE_SIZE;

        if ($next < $this->entries->referenceCount($entry)) {
            $nextPage = LayoutActionData::changing(['cursor' => (string) $next]);
            $parts[] = LayoutPartData::action('next', 'Next page', $nextPage);
        }

        return LayoutPartData::box('references-page', 'stack', ...$parts);
    }
}
