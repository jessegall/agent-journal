<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Bus\Contracts\ProvidesCommandMiddleware;
use App\Bus\Contracts\ProvidesCommands;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Concerns\HasLinkRecords;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\ProvidesAssignables;
use App\Domains\Contracts\ProvidesLinkRecords;
use App\Domains\Contracts\ProvidesStates;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Contracts\ProvidesSections;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use Domain\Rules\RulesDomain;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\Api\NoteValue;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\AuditNotes;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\AuditRules;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordAll;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordWriteNote;
use Tests\Fixtures\Modules\Notes\Commands\ClearNotes;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote;
use Tests\Fixtures\Modules\Notes\Commands\EngineCopyNote;
use Tests\Fixtures\Modules\Notes\Commands\EngineNote;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote;
use Tests\Fixtures\Modules\Notes\Commands\KeepNote;
use Tests\Fixtures\Modules\Notes\Commands\OpenTransactionNote;
use Tests\Fixtures\Modules\Notes\Commands\PinNote;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;
use Tests\Fixtures\Modules\Notes\Commands\SystemNote;
use Tests\Fixtures\Modules\Notes\Commands\UserNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;
use Tests\Fixtures\Modules\Notes\Contracts\NoteReader;
use Tests\Fixtures\Modules\Notes\Links\NoteLinkRecords;
use Tests\Fixtures\Modules\Notes\Links\NotePageLinkRecords;
use Tests\Fixtures\Modules\Notes\Links\NoteSnapshotLinkRecords;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Models\NoteSnapshot;
use Tests\Fixtures\Modules\Notes\Readers\CollectionChildren;
use Tests\Fixtures\Modules\Notes\Readers\CollectionWindowReader;
use Tests\Fixtures\Modules\Notes\Readers\NoteSectionReader;
use Tests\Fixtures\Modules\Notes\Readers\NotesWindowReader;
use Tests\Fixtures\Modules\Notes\Support\NoteAssignments;

/**
 * A module installed outside the domain folder, registered beside the domains only in the architecture fixtures.
 */
final class NotesDomain extends Domain implements ProvidesAssignables, ProvidesCommandMiddleware, ProvidesCommands, ProvidesLinkRecords, ProvidesNavigation, ProvidesNumberedModels, ProvidesPages, ProvidesSections, ProvidesStates
{
    use HasAssignables, HasLinkRecords, HasNumberedModels, HasStates;

    public function description(): string
    {
        return 'Notes an agent writes while it works: a module outside the domain folder.';
    }

    public function requires(): array
    {
        return [CardsDomain::class, RulesDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->contracts(NoteReader::class)
            ->values(NoteValue::class)
            ->commands(WriteNote::class)
            ->build();
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Note::class), NumberedModel::global(NotePage::class), NumberedModel::global(NoteSnapshot::class)];
    }

    public function linkRecords(): array
    {
        return [Note::LINK_TYPE => NoteLinkRecords::class, NotePage::LINK_TYPE => NotePageLinkRecords::class, NoteSnapshot::LINK_TYPE => NoteSnapshotLinkRecords::class];
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
        return [Section::make('count', 'Notes', 'chat.dock', SlotContextType::Session, NoteSectionReader::class, 'NoteSection.vue')];
    }

    public function commands(): array
    {
        return [WriteNote::class, PinNote::class, CopyNote::class, RefuseNote::class, IgnoreFailedNote::class, OpenTransactionNote::class, UserNote::class, SystemNote::class, ClearNotes::class, EngineNote::class, EngineCopyNote::class, KeepNote::class];
    }

    public function commandMiddleware(): array
    {
        return [
            MiddlewareDeclaration::around(RecordAll::class, CommandScope::all()),
            MiddlewareDeclaration::around(RecordWriteNote::class, CommandScope::command(WriteNote::class)),
            MiddlewareDeclaration::inside(AuditNotes::class, CommandScope::ownedBy(self::class)),
            MiddlewareDeclaration::inside(AuditRules::class, CommandScope::ownedBy(RulesDomain::class)),
        ];
    }
}
