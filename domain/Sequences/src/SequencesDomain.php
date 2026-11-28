<?php

declare(strict_types=1);

namespace Domain\Sequences;

use Domain\Sequences\Http\Pages\NewSequencePageBuilder;
use Domain\Sequences\Http\Pages\NewSequencePageData;
use Domain\Sequences\Http\Pages\SequenceEditorPageBuilder;
use Domain\Sequences\Http\Pages\SequenceEditorPageData;
use Domain\Sequences\Http\Pages\SequenceIndexPageBuilder;
use Domain\Sequences\Http\Pages\SequenceIndexPageData;
use Domain\Sequences\Http\Pages\SequencePageBuilder;
use Domain\Sequences\Http\Pages\SequencePageData;
use Domain\Sequences\Http\Pages\SequenceRunPageBuilder;
use Domain\Sequences\Http\Pages\SequenceRunPageData;
use Domain\Sequences\Http\Pages\SequenceRunsPageBuilder;
use Domain\Sequences\Http\Pages\SequenceRunsPageData;
use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Agents\Enums\AccessType;
use App\Concerns\HasStates;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Navigation\Contracts\DraftProducerProvider;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Records\Contracts\StateProvider;
use App\Skills\Contracts\SkillProvider;
use App\Support\Domain;
use App\Support\Exports;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Http\Controllers\ChangeSequenceController;
use Domain\Sequences\Http\Controllers\DefineSequenceController;
use Domain\Sequences\Policies\SequencePolicy;
use Domain\Sequences\Policies\StoredSequencePolicy;
use Domain\Sequences\Support\SequenceDraftProducer;
use Domain\Sequences\Support\Skills\SequencesSkill;
use Domain\Sequences\Support\States\FollowSequenceState;

final class SequencesDomain extends Domain implements
    DraftProducerProvider,
    NativePartProvider,
    NavigationProvider,
    PageProvider,
    PolicyProvider,
    SkillProvider,
    StateProvider
{
    use HasStates;

    public function description(): string
    {
        return 'Steps an agent follows one at a time.';
    }

    public function draftProducers(): array
    {
        return ['sequence' => SequenceDraftProducer::class];
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                SequencePolicy::class,
                [AccessType::Create, AccessType::Edit],
            ),
            new PolicyDefinition(
                StoredSequencePolicy::class,
                [AccessType::Read, AccessType::Create, AccessType::Edit],
            ),
        ];
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    /**
     * The native part a declared page mounts to edit the steps of a sequence definition.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['SequenceEditor.vue'];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('index', 'Sequences', Icon::Sequence, position: 40)];
    }

    /**
     * The run page, reached by a run's own link, and the Sequences page the sidebar opens.
     */
    public function pages(): array
    {
        return [
            Page::build()
                ->key('index')
                ->title('Sequences')
                ->icon(Icon::Sequence)
                ->pageType(SequenceIndexPageData::class)
                ->pageBuilder(SequenceIndexPageBuilder::class)
                ->declaredLayout()
                ->finish()
                ->at('')
                ->actions(fn (PageActions $actions) => $actions
                    ->post('create', DefineSequenceController::class, 'define-sequence')),
            Page::build()
                ->key('new')
                ->title('New sequence')
                ->icon(Icon::Sequence)
                ->pageType(NewSequencePageData::class)
                ->pageBuilder(NewSequencePageBuilder::class)
                ->declaredLayout()
                ->finish()->at('new'),
            Page::build()
                ->key('runs')
                ->title('Runs')
                ->icon(Icon::Activity)
                ->pageType(SequenceRunsPageData::class)
                ->pageBuilder(SequenceRunsPageBuilder::class)
                ->declaredLayout()
                ->finish()->at('runs'),
            Page::build()
                ->key('edit')
                ->title('Edit steps')
                ->icon(Icon::Sequence)
                ->pageType(SequenceEditorPageData::class)
                ->pageBuilder(SequenceEditorPageBuilder::class)
                ->declaredLayout()
                ->finish()->at('{sequence}/edit'),
            Page::build()
                ->key('sequence')
                ->title('Sequence')
                ->icon(Icon::Sequence)
                ->pageType(SequencePageData::class)
                ->pageBuilder(SequencePageBuilder::class)
                ->declaredLayout()
                ->finish()
                ->at('{sequence}')
                ->actions(fn (PageActions $actions) => $actions
                    ->patch('{sequence}', ChangeSequenceController::class, 'change-sequence')),
            Page::build()
                ->key('run')
                ->title('Sequence run')
                ->icon(Icon::Activity)
                ->pageType(SequenceRunPageData::class)
                ->pageBuilder(SequenceRunPageBuilder::class)
                ->declaredLayout()
                ->finish()->at('runs/{run}'),
        ];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->events(SequenceStarted::class)
            ->build();
    }

    public function states(): array
    {
        return [FollowSequenceState::class];
    }

    public function skills(): array
    {
        return [SequencesSkill::class];
    }
}
