<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Assignments\Contracts\AssignableContributor;
use App\Bus\CommandScope;
use App\Bus\Contracts\CommandMiddlewareProvider;
use App\Bus\Contracts\CommandProvider;
use App\Bus\Contracts\CommandRuleProvider;
use App\Bus\MiddlewareDeclaration;
use App\CommandRules\Enums\CommandClass;
use App\CommandRules\Values\ProgramSpellings;
use App\Concerns\HasAssignables;
use App\Concerns\HasLinkRecords;
use App\Concerns\HasStates;
use App\Declarations\Page;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Contracts\SectionProvider;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Profiles\Enums\SlotContextType;
use App\Records\Contracts\LinkRecordProvider;
use App\Records\Contracts\StateProvider;
use App\Skills\Contracts\SkillConditionProvider;
use App\Skills\Contracts\SkillProvider;
use App\Skills\Values\SkillConditionDefinition;
use App\Support\Domain;
use App\Support\Exports;
use App\Text\Declarations\Section;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Web\Declarations\Slot;
use Domain\Rules\RulesDomain;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\Api\NoteValue;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\AuditNotes;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\AuditRules;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordAll;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordWriteNote;
use Tests\Fixtures\Modules\Notes\Commands\AuditNote\AuditNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\ClearNotes\ClearNotesCommand;
use Tests\Fixtures\Modules\Notes\Commands\CopyLimitNote\CopyLimitNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote\CopyNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\EngineCopyNote\EngineCopyNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\EngineNote\EngineNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote\IgnoreFailedNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\KeepNote\KeepNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\LimitNote\LimitNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\OpenTransactionNote\OpenTransactionNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\PinNote\PinNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect\RecordNoteEffectCommand;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote\RefuseNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\RetainNote\RetainNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\SetIntegerSettingThenFail\SetIntegerSettingThenFailCommand;
use Tests\Fixtures\Modules\Notes\Commands\SystemNote\SystemNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\UserNote\UserNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Fixtures\Modules\Notes\Contracts\NoteResolver;
use Tests\Fixtures\Modules\Notes\Events\NoteRemoved;
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
    CommandProvider,
    CommandRuleProvider,
    LinkRecordProvider,
    NavigationProvider,
    PageProvider,
    PolicyProvider,
    SectionProvider,
    SkillConditionProvider,
    SkillProvider,
    StateProvider
{
    use HasAssignables;
    use HasLinkRecords;
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
            ->commands(WriteNoteCommand::class)
            ->build();
    }

    public function linkRecords(): array
    {
        return [
            Note::linkType() => NoteLinkRecords::class,
            NotePage::linkType() => NotePageLinkRecords::class,
            NoteSnapshot::linkType() => NoteSnapshotLinkRecords::class,
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
            WriteNoteState::class,
            WatchNoteState::class,
        ];
    }

    public function assignables(): array
    {
        return [Note::linkType() => NoteAssignments::class];
    }

    public function pages(): array
    {
        return [
            Page::make('index', 'Notes', Icon::Docs, NotesWindowResolver::class, 'Index.vue')->at(''),
            Page::make('collection', 'Collection', Icon::Docs, CollectionWindowResolver::class, 'Collection.vue')
                ->at('collections/{collection}')
                ->slots(Slot::record('note', 'collection', 'collection')),
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
            WriteNoteCommand::class,
            AuditNoteCommand::class,
            PinNoteCommand::class,
            CopyNoteCommand::class,
            RefuseNoteCommand::class,
            RecordNoteEffectCommand::class,
            IgnoreFailedNoteCommand::class,
            OpenTransactionNoteCommand::class,
            UserNoteCommand::class,
            SystemNoteCommand::class,
            ClearNotesCommand::class,
            EngineNoteCommand::class,
            EngineCopyNoteCommand::class,
            KeepNoteCommand::class,
            RetainNoteCommand::class,
            LimitNoteCommand::class,
            CopyLimitNoteCommand::class,
            SetIntegerSettingThenFailCommand::class,
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
            MiddlewareDeclaration::around(RecordWriteNote::class, CommandScope::command(WriteNoteCommand::class)),
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
