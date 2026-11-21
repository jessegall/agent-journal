<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use Tests\Fixtures\Modules\Notes\Events\NoteRemoved;
use App\Operations\Enums\AccessType;
use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyDefinition;
use App\Bus\Contracts\CommandMiddlewareProvider;
use App\Bus\Contracts\CommandProvider;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Concerns\HasLinkRecords;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\AssignableContributor;
use App\Domains\Contracts\LinkRecordProvider;
use App\Domains\Contracts\StateProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\NumberedModelProvider;
use App\Numbers\Support\NumberedModel;
use App\Processes\Contracts\CommandRuleProvider;
use App\Processes\Enums\CommandClass;
use App\Processes\Values\ArgumentGrammar;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ProgramSpellings;
use App\Skills\Contracts\SkillConditionProvider;
use App\Skills\Contracts\SkillProvider;
use App\Skills\Values\SkillConditionDefinition;
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Contracts\SectionProvider;
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
use Tests\Fixtures\Modules\Notes\Commands\CopyLimitNote;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote;
use Tests\Fixtures\Modules\Notes\Commands\EngineCopyNote;
use Tests\Fixtures\Modules\Notes\Commands\EngineNote;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote;
use Tests\Fixtures\Modules\Notes\Commands\KeepNote;
use Tests\Fixtures\Modules\Notes\Commands\LimitNote;
use Tests\Fixtures\Modules\Notes\Commands\OpenTransactionNote;
use Tests\Fixtures\Modules\Notes\Commands\PinNote;
use Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;
use Tests\Fixtures\Modules\Notes\Commands\RetainNote;
use Tests\Fixtures\Modules\Notes\Commands\SetIntegerSettingThenFail;
use Tests\Fixtures\Modules\Notes\Commands\SystemNote;
use Tests\Fixtures\Modules\Notes\Commands\UserNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;
use Tests\Fixtures\Modules\Notes\Contracts\NoteResolver;
use Tests\Fixtures\Modules\Notes\Links\NoteLinkRecords;
use Tests\Fixtures\Modules\Notes\Links\NotePageLinkRecords;
use Tests\Fixtures\Modules\Notes\Links\NoteSnapshotLinkRecords;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Models\NoteSnapshot;
use Tests\Fixtures\Modules\Notes\Policies\NotePolicy;
use Tests\Fixtures\Modules\Notes\Policies\NoteWorkPolicy;
use Tests\Fixtures\Modules\Notes\Resolvers\CollectionChildren;
use Tests\Fixtures\Modules\Notes\Resolvers\CollectionWindowResolver;
use Tests\Fixtures\Modules\Notes\Resolvers\NoteSectionResolver;
use Tests\Fixtures\Modules\Notes\Resolvers\NotesWindowResolver;
use Tests\Fixtures\Modules\Notes\Skills\HasNotesCondition;
use Tests\Fixtures\Modules\Notes\Skills\HasNotesParameters;
use Tests\Fixtures\Modules\Notes\Skills\NotesSkill;
use Tests\Fixtures\Modules\Notes\Support\NoteAssignments;

/**
 * A module installed outside the domain folder, registered beside the domains only in the architecture fixtures.
 */
final class NotesDomain extends Domain implements
    AssignableContributor,
    CommandMiddlewareProvider,
    CommandRuleProvider,
    CommandProvider,
    LinkRecordProvider,
    NavigationProvider,
    NumberedModelProvider,
    PageProvider,
    PolicyProvider,
    SectionProvider,
    SkillConditionProvider,
    SkillProvider,
    StateProvider
{
    use HasAssignables;
    use HasLinkRecords;
    use HasNumberedModels;
    use HasStates;

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
            ->events(NoteRemoved::class)
            ->contracts(NoteResolver::class)
            ->values(NoteValue::class)
            ->commands(WriteNote::class)
            ->build();
    }

    public function numberedModels(): array
    {
        return [
            NumberedModel::global(Note::class),
            NumberedModel::global(NotePage::class),
            NumberedModel::global(NoteSnapshot::class),
        ];
    }

    public function linkRecords(): array
    {
        return [
            Note::LINK_TYPE => NoteLinkRecords::class,
            NotePage::LINK_TYPE => NotePageLinkRecords::class,
            NoteSnapshot::LINK_TYPE => NoteSnapshotLinkRecords::class,
        ];
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(NotePolicy::class, [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete]),
            new PolicyDefinition(NoteWorkPolicy::class, [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete]),
        ];
    }

    public function states(): array
    {
        return [
            'notes.writing' => WritingNoteStateFactory::class,
            'notes.watching' => WatchingNoteStateFactory::class,
        ];
    }

    public function assignables(): array
    {
        return [Note::LINK_TYPE => NoteAssignments::class];
    }

    public function pages(): array
    {
        return [
            Page::make('index', 'Notes', Icon::Docs, NotesWindowResolver::class, 'Index.vue')->at(''),
            Page::make('collection', 'Collection', Icon::Docs, CollectionWindowResolver::class, 'Collection.vue')
                ->at('collections/{collection}')
                ->slots(Slot::record('note', 'collection')),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('index', 'Notes', Icon::Docs, position: 50)->children([
                NavigationItem::heading('collections', 'Collections', childrenResolver: CollectionChildren::class),
            ]),
        ];
    }

    public function sections(): array
    {
        return [Section::make(
            'count',
            'Notes',
            'chat.dock',
            SlotContextType::Session,
            NoteSectionResolver::class,
            'NoteSection.vue',
        )];
    }

    public function commands(): array
    {
        return [
            WriteNote::class,
            PinNote::class,
            CopyNote::class,
            RefuseNote::class,
            RecordNoteEffect::class,
            IgnoreFailedNote::class,
            OpenTransactionNote::class,
            UserNote::class,
            SystemNote::class,
            ClearNotes::class,
            EngineNote::class,
            EngineCopyNote::class,
            KeepNote::class,
            RetainNote::class,
            LimitNote::class,
            CopyLimitNote::class,
            SetIntegerSettingThenFail::class,
        ];
    }

    public function skills(): array
    {
        return [NotesSkill::class];
    }

    public function skillConditions(): array
    {
        return [
            new SkillConditionDefinition('notes.has-notes', 1, HasNotesParameters::class, HasNotesCondition::class),
        ];
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

    /**
     * The module's own command-line tool: notes-cli list only reads notes.
     *
     * @return list<CommandRule>
     */
    public function commandRules(): array
    {
        return [
            CommandRule::forProgram(
                'notes.notes-cli.list',
                new ProgramSpellings('notes-cli'),
                ['list'],
                ArgumentGrammar::options(['--all']),
                CommandClassSet::of(CommandClass::Read),
            ),
        ];
    }
}
