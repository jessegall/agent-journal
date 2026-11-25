<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use Tests\Fixtures\Modules\Notes\Commands\AuditNote\AuditNoteCommand;
use Tests\Fixtures\Modules\Notes\Events\NoteRemoved;
use App\Enums\Agents\AccessType;
use App\Contracts\Authorization\PolicyProvider;
use App\Values\PolicyDefinition;
use App\Contracts\Bus\CommandMiddlewareProvider;
use App\Contracts\Bus\CommandProvider;
use App\Support\CommandScope;
use App\Support\MiddlewareDeclaration;
use App\Concerns\HasAssignables;
use App\Concerns\HasLinkRecords;
use App\Concerns\HasStates;
use App\Contracts\Assignments\AssignableContributor;
use App\Contracts\Records\LinkRecordProvider;
use App\Contracts\Records\StateProvider;
use App\Support\Domain;
use App\Support\Exports;
use App\Contracts\Bus\CommandRuleProvider;
use App\Enums\CommandRules\CommandClass;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ProgramSpellings;
use App\Contracts\Skills\SkillConditionProvider;
use App\Contracts\Skills\SkillProvider;
use App\Values\SkillConditionDefinition;
use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Navigation\SectionProvider;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Declarations\Section;
use App\Declarations\Slot;
use App\Enums\Navigation\Icon;
use App\Enums\Profiles\SlotContextType;
use Domain\Rules\RulesDomain;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\Api\NoteValue;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\AuditNotes;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\AuditRules;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordAll;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordWriteNote;
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
