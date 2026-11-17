<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Core\Ui\Contracts\ProvidesNavigation;
use App\Core\Ui\Contracts\ProvidesPages;
use App\Core\Ui\Contracts\ProvidesSections;
use App\Core\Ui\Declarations\NavigationItem;
use App\Core\Ui\Declarations\Page;
use App\Core\Ui\Declarations\Section;
use App\Core\Ui\Declarations\Slot;
use App\Core\Ui\Enums\Icon;
use App\Core\Ui\Enums\SlotContextKind;
use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesAssignables;
use App\Domain\Contracts\ProvidesStates;
use Tests\Fixtures\Modules\Notes\Api\NoteValue;
use Tests\Fixtures\Modules\Notes\Contracts\NoteReader;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\Readers\CollectionChildren;
use Tests\Fixtures\Modules\Notes\Readers\CollectionWindowReader;
use Tests\Fixtures\Modules\Notes\Readers\NoteSectionReader;
use Tests\Fixtures\Modules\Notes\Readers\NotesWindowReader;
use Tests\Fixtures\Modules\Notes\Support\NoteAssignments;

/**
 * A module installed outside app/Domain, registered beside the domains only in the architecture fixtures.
 */
final class NotesDomain implements Domain, ProvidesAssignables, ProvidesNavigation, ProvidesPages, ProvidesSections, ProvidesStates
{
    public function description(): string
    {
        return 'Notes an agent writes while it works: a module outside app/Domain.';
    }

    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [NoteReader::class, NoteValue::class];
    }

    public function states(): array
    {
        return ['notes.writing' => WritingNoteStateFactory::class];
    }

    public function assignables(): array
    {
        return [Note::LINK_TYPE => NoteAssignments::class];
    }

    public function pages(): array
    {
        return [
            Page::make('index', 'Notes', Icon::Docs, NotesWindowReader::class, 'Index.vue')->at(''),
            Page::make('collection', 'Collection', Icon::Docs, CollectionWindowReader::class, 'Collection.vue')
                ->at('collections/{collection}')
                ->slots(Slot::record('note', 'collection')),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('index', 'Notes', Icon::Docs, position: 50)->children([
                NavigationItem::heading('collections', 'Collections', childrenReader: CollectionChildren::class),
            ]),
        ];
    }

    public function sections(): array
    {
        return [Section::make('count', 'Notes', 'chat.dock', SlotContextKind::Session, NoteSectionReader::class, 'NoteSection.vue')];
    }
}
