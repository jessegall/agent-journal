<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Domains\Bootstrappers\RegisterStates;
use App\Domains\Bootstrappers\RegisterAssignables;
use App\Domains\Bootstrappers\LoadMigrations;
use App\Domains\Contracts\ProvidesBootstrappers;
use App\Bus\Contracts\ProvidesCommandMiddleware;
use App\Bus\Contracts\ProvidesCommands;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesAssignables;
use App\Domains\Contracts\ProvidesStates;
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
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote;
use Tests\Fixtures\Modules\Notes\Commands\OpenTransactionNote;
use Tests\Fixtures\Modules\Notes\Commands\PinNote;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;
use Tests\Fixtures\Modules\Notes\Commands\UserNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;
use Tests\Fixtures\Modules\Notes\Contracts\NoteReader;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\Readers\CollectionChildren;
use Tests\Fixtures\Modules\Notes\Readers\CollectionWindowReader;
use Tests\Fixtures\Modules\Notes\Readers\NoteSectionReader;
use Tests\Fixtures\Modules\Notes\Readers\NotesWindowReader;
use Tests\Fixtures\Modules\Notes\Support\NoteAssignments;

/**
 * A module installed outside the domain folder, registered beside the domains only in the architecture fixtures.
 */
final class NotesDomain implements Domain, ProvidesAssignables, ProvidesCommandMiddleware, ProvidesCommands, ProvidesNavigation, ProvidesPages, ProvidesSections, ProvidesStates, ProvidesBootstrappers
{
    public function description(): string
    {
        return 'Notes an agent writes while it works: a module outside the domain folder.';
    }

    public function bootstrappers(): array
    {
        return [LoadMigrations::class, RegisterAssignables::class, RegisterStates::class];
    }

    public function requires(): array
    {
        return [CardsDomain::class, RulesDomain::class];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [NoteReader::class, NoteValue::class, WriteNote::class];
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
        return [WriteNote::class, PinNote::class, CopyNote::class, RefuseNote::class, IgnoreFailedNote::class, OpenTransactionNote::class, UserNote::class, ClearNotes::class];
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
